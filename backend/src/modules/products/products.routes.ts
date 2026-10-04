import { FastifyInstance } from 'fastify';
import { db } from '../../db/index.js';
import { products, productVariants, categories } from '../../db/schema/index.js';
import { eq, ilike, or, and } from 'drizzle-orm';
import { getProductsQuerySchema, getProductParamsSchema } from './products.schema.js';
import { mockProducts } from '../../data/mockCatalog.js';
import { authenticate, authorizeAdmin } from '../auth/auth.middleware.js';
import { z } from 'zod';

const createProductBodySchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  categoryId: z.string().min(1, 'Category is required.'),
  brand: z.string().optional(),
  description: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative.'),
  originalPrice: z.number().nonnegative('Original price cannot be negative.').optional(),
  image: z.string().min(1, 'Product image URL is required.'),
  stock: z.number().int().nonnegative('Stock cannot be negative.').default(10).optional(),
});

export async function productRoutes(app: FastifyInstance) {
  // GET /api/v1/products
  app.get('/api/v1/products', async (request, reply) => {
    const parseResult = getProductsQuerySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_QUERY_PARAMS',
          message: 'Invalid query parameters provided.',
          details: parseResult.error.format(),
        },
      });
    }

    const { category, search } = parseResult.data;

    try {
      let conditions = [];

      if (category) {
        const matchedCat = await db
          .select()
          .from(categories)
          .where(or(eq(categories.id, category), eq(categories.handle, category)))
          .limit(1);

        if (matchedCat.length > 0) {
          conditions.push(eq(products.categoryId, matchedCat[0].id));
        } else {
          conditions.push(eq(products.categoryId, category));
        }
      }

      if (search) {
        conditions.push(
          or(
            ilike(products.title, `%${search}%`),
            ilike(products.brand, `%${search}%`),
            ilike(products.description, `%${search}%`)
          )
        );
      }

      const query = conditions.length > 0
        ? db.select().from(products).where(and(...conditions))
        : db.select().from(products);

      const dbProducts = await query;

      if (dbProducts && dbProducts.length > 0) {
        const productList = await Promise.all(
          dbProducts.map(async (p) => {
            const variants = await db
              .select()
              .from(productVariants)
              .where(eq(productVariants.productId, p.id));

            return {
              id: p.id,
              name: p.title,
              category_id: p.categoryId,
              brand: p.brand,
              description: p.description,
              price: Number(p.price),
              original_price: p.originalPrice ? Number(p.originalPrice) : undefined,
              images: [p.image],
              rating: {
                rate: Number(p.ratingRate || 0),
                count: p.ratingCount || 0,
              },
              variants: variants.map(v => ({
                id: v.id,
                sku: v.sku,
                price: Number(v.price),
                stock: v.stock,
                image: v.image,
                options: v.options,
              })),
            };
          })
        );

        return reply.status(200).send({
          success: true,
          data: productList,
        });
      }
    } catch {
      // Fallback
    }

    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter(p => p.category_id === category || p.category_id.includes(category));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return reply.status(200).send({
      success: true,
      data: filtered,
    });
  });

  // GET /api/v1/products/:id
  app.get('/api/v1/products/:id', async (request, reply) => {
    const parseResult = getProductParamsSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_ROUTE_PARAMS',
          message: 'Invalid product ID parameter.',
        },
      });
    }

    const { id } = parseResult.data;

    try {
      const matched = await db.select().from(products).where(eq(products.id, id)).limit(1);

      if (matched.length > 0) {
        const p = matched[0];
        const variants = await db
          .select()
          .from(productVariants)
          .where(eq(productVariants.productId, p.id));

        return reply.status(200).send({
          success: true,
          data: {
            id: p.id,
            name: p.title,
            category_id: p.categoryId,
            brand: p.brand,
            description: p.description,
            price: Number(p.price),
            original_price: p.originalPrice ? Number(p.originalPrice) : undefined,
            images: [p.image],
            rating: {
              rate: Number(p.ratingRate || 0),
              count: p.ratingCount || 0,
            },
            variants: variants.map(v => ({
              id: v.id,
              sku: v.sku,
              price: Number(v.price),
              stock: v.stock,
              image: v.image,
              options: v.options,
            })),
          },
        });
      }
    } catch {
      // Database offline fallback
    }

    const mockItem = mockProducts.find(p => p.id === id);
    if (mockItem) {
      return reply.status(200).send({
        success: true,
        data: mockItem,
      });
    }

    return reply.status(404).send({
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: `Product with ID '${id}' was not found.`,
      },
    });
  });

  // POST /api/v1/products (ADMIN ONLY)
  app.post('/api/v1/products', { preHandler: [authenticate, authorizeAdmin] }, async (request, reply) => {
    const parseResult = createProductBodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid product creation input.',
          details: parseResult.error.format(),
        },
      });
    }

    const body = parseResult.data;
    const newId = `prod-${Date.now()}`;
    const priceStr = body.price.toFixed(2);
    const origPriceStr = body.originalPrice !== undefined ? body.originalPrice.toFixed(2) : null;

    try {
      await db.insert(products).values({
        id: newId,
        categoryId: body.categoryId,
        title: body.title,
        brand: body.brand || 'Lumina',
        description: body.description || '',
        price: priceStr,
        originalPrice: origPriceStr,
        image: body.image,
        ratingRate: '5.00',
        ratingCount: 1,
      });

      const defaultVariantId = `var-${newId}-default`;
      const sku = `${newId}-default`;
      await db.insert(productVariants).values({
        id: defaultVariantId,
        productId: newId,
        sku,
        price: priceStr,
        stock: body.stock ?? 25,
        image: body.image,
        options: { Standard: 'Default' },
      });

      return reply.status(201).send({
        success: true,
        data: {
          id: newId,
          name: body.title,
          category_id: body.categoryId,
          brand: body.brand || 'Lumina',
          description: body.description || '',
          price: body.price,
          original_price: body.originalPrice,
          images: [body.image],
          rating: { rate: 5.0, count: 1 },
        },
      });
    } catch {
      // Dev mock insertion fallback
      const mockNew = {
        id: newId,
        name: body.title,
        category_id: body.categoryId,
        brand: body.brand || 'Lumina',
        status: true,
        description: body.description || '',
        price: body.price,
        original_price: body.originalPrice,
        images: [body.image],
        rating: { rate: 5.0, count: 1 },
      };
      mockProducts.unshift(mockNew as any);
      return reply.status(201).send({ success: true, data: mockNew });
    }
  });

  // PUT /api/v1/products/:id (ADMIN ONLY)
  app.put('/api/v1/products/:id', { preHandler: [authenticate, authorizeAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parseResult = createProductBodySchema.partial().safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid product update fields.' },
      });
    }

    const body = parseResult.data;

    try {
      const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
      if (existing.length === 0) {
        return reply.status(404).send({
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: `Product '${id}' not found.` },
        });
      }

      await db
        .update(products)
        .set({
          ...(body.title && { title: body.title }),
          ...(body.categoryId && { categoryId: body.categoryId }),
          ...(body.brand && { brand: body.brand }),
          ...(body.description && { description: body.description }),
          ...(body.price !== undefined && { price: body.price.toFixed(2) }),
          ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice.toFixed(2) }),
          ...(body.image && { image: body.image }),
          updatedAt: new Date(),
        })
        .where(eq(products.id, id));

      if (body.price !== undefined) {
        await db
          .update(productVariants)
          .set({ price: body.price.toFixed(2) })
          .where(eq(productVariants.productId, id));
      }

      return reply.status(200).send({
        success: true,
        data: { id, message: 'Product updated successfully.' },
      });
    } catch {
      // Fallback
    }

    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProducts[idx] = { ...mockProducts[idx], ...body, name: body.title || mockProducts[idx].name };
      return reply.status(200).send({ success: true, data: mockProducts[idx] });
    }

    return reply.status(404).send({
      success: false,
      error: { code: 'PRODUCT_NOT_FOUND', message: `Product '${id}' not found.` },
    });
  });

  // DELETE /api/v1/products/:id (ADMIN ONLY)
  app.delete('/api/v1/products/:id', { preHandler: [authenticate, authorizeAdmin] }, async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return reply.status(200).send({
        success: true,
        data: { id, message: 'Product deleted successfully.' },
      });
    } catch {
      // Fallback
    }

    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProducts.splice(idx, 1);
      return reply.status(200).send({ success: true, data: { id, message: 'Product deleted successfully.' } });
    }

    return reply.status(404).send({
      success: false,
      error: { code: 'PRODUCT_NOT_FOUND', message: `Product '${id}' not found.` },
    });
  });
}
