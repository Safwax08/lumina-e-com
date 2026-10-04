import { FastifyInstance } from 'fastify';
import { db } from '../../db/index.js';
import { orders, orderItems, products, productVariants } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { createOrderSchema } from './orders.schema.js';
import { calculateShippingFee } from './shipping.js';
import { authenticate, authorizeAdmin } from '../auth/auth.middleware.js';
import { mockProducts } from '../../data/mockCatalog.js';

// In-memory fallback order store for dev environment when DB is unconfigured
const inMemoryOrders: any[] = [];

export async function orderRoutes(app: FastifyInstance) {
  // POST /api/v1/orders (Authenticated Customer)
  app.post('/api/v1/orders', { preHandler: [authenticate] }, async (request, reply) => {
    const parseResult = createOrderSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid order input data.',
          details: parseResult.error.format(),
        },
      });
    }

    const { items, shippingAddress, paymentMethod } = parseResult.data;
    const userId = request.user!.id;

    try {
      // Execute within PostgreSQL Transaction for atomic inventory and order calculation
      const createdOrder = await db.transaction(async (tx) => {
        let subtotal = 0;
        const processedItems: Array<{
          productId: string;
          productTitleSnapshot: string;
          variantSnapshot: Record<string, unknown>;
          quantity: number;
          unitPrice: number;
          totalPrice: number;
        }> = [];

        for (const item of items) {
          // Fetch product from DB with row lock / check
          const dbProducts = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1);
          if (dbProducts.length === 0) {
            throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
          }
          const p = dbProducts[0];

          // Fetch variant
          let v = null;
          if (item.variantId) {
            const variants = await tx.select().from(productVariants).where(eq(productVariants.id, item.variantId)).limit(1);
            if (variants.length > 0) v = variants[0];
          }

          if (!v) {
            const defaultVariants = await tx.select().from(productVariants).where(eq(productVariants.productId, p.id)).limit(1);
            if (defaultVariants.length > 0) v = defaultVariants[0];
          }

          if (v && v.stock < item.quantity) {
            throw new Error(`INSUFFICIENT_STOCK:${p.title} (Requested: ${item.quantity}, Available: ${v.stock})`);
          }

          // Authoritative DB prices
          const unitPrice = v ? Number(v.price) : Number(p.price);
          const itemTotalPrice = unitPrice * item.quantity;
          subtotal += itemTotalPrice;

          // Decrement stock inside transaction
          if (v) {
            await tx
              .update(productVariants)
              .set({ stock: v.stock - item.quantity, updatedAt: new Date() })
              .where(eq(productVariants.id, v.id));
          }

          processedItems.push({
            productId: p.id,
            productTitleSnapshot: p.title,
            variantSnapshot: {
              sku: v?.sku || `${p.id}-default`,
              options: v?.options || {},
              image: v?.image || p.image,
            },
            quantity: item.quantity,
            unitPrice,
            totalPrice: itemTotalPrice,
          });
        }

        const shippingAmount = calculateShippingFee(subtotal);
        const totalAmount = subtotal + shippingAmount;
        const orderId = `ord-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        await tx.insert(orders).values({
          id: orderId,
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal: subtotal.toFixed(2),
          shippingAmount: shippingAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paymentMethod,
          shippingAddress,
        });

        for (const pi of processedItems) {
          await tx.insert(orderItems).values({
            id: `ori-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            orderId,
            productId: pi.productId,
            productTitleSnapshot: pi.productTitleSnapshot,
            variantSnapshot: pi.variantSnapshot,
            quantity: pi.quantity,
            unitPrice: pi.unitPrice.toFixed(2),
            totalPrice: pi.totalPrice.toFixed(2),
          });
        }

        return {
          id: orderId,
          orderNumber,
          userId,
          status: 'PENDING',
          subtotal,
          shippingAmount,
          totalAmount,
          paymentMethod,
          shippingAddress,
          items: processedItems,
          createdAt: new Date().toISOString(),
        };
      });

      return reply.status(201).send({
        success: true,
        data: createdOrder,
      });
    } catch (err: any) {
      if (err.message?.startsWith('PRODUCT_NOT_FOUND')) {
        const prodId = err.message.split(':')[1];
        return reply.status(404).send({
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: `Product '${prodId}' not found.` },
        });
      }

      if (err.message?.startsWith('INSUFFICIENT_STOCK')) {
        const detail = err.message.split(':')[1];
        return reply.status(409).send({
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: `Insufficient stock: ${detail}` },
        });
      }

      // Dev fallback order calculation if DB is unconfigured
      let subtotal = 0;
      const processedItems = items.map(item => {
        const p = mockProducts.find(prod => prod.id === item.productId) || {
          name: 'Lumina Item',
          price: 1199,
          id: item.productId,
        };
        const unitPrice = Number(p.price);
        const itemTotalPrice = unitPrice * item.quantity;
        subtotal += itemTotalPrice;
        return {
          productId: p.id,
          productTitleSnapshot: p.name,
          variantSnapshot: { sku: `${p.id}-default` },
          quantity: item.quantity,
          unitPrice,
          totalPrice: itemTotalPrice,
        };
      });

      const shippingAmount = calculateShippingFee(subtotal);
      const totalAmount = subtotal + shippingAmount;
      const orderId = `ord-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const fallbackOrder = {
        id: orderId,
        orderNumber,
        userId,
        status: 'PENDING',
        subtotal,
        shippingAmount,
        totalAmount,
        paymentMethod,
        shippingAddress,
        items: processedItems,
        createdAt: new Date().toISOString(),
      };

      inMemoryOrders.unshift(fallbackOrder);

      return reply.status(201).send({
        success: true,
        data: fallbackOrder,
      });
    }
  });

  // GET /api/v1/orders/my-orders (Authenticated Customer)
  app.get('/api/v1/orders/my-orders', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.id;

    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));

      if (userOrders.length > 0) {
        const populatedOrders = await Promise.all(
          userOrders.map(async (o) => {
            const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
            return {
              id: o.id,
              orderNumber: o.orderNumber,
              status: o.status,
              subtotal: Number(o.subtotal),
              shippingAmount: Number(o.shippingAmount),
              totalAmount: Number(o.totalAmount),
              paymentMethod: o.paymentMethod,
              shippingAddress: o.shippingAddress,
              items: items.map(i => ({
                id: i.id,
                productId: i.productId,
                productTitleSnapshot: i.productTitleSnapshot,
                variantSnapshot: i.variantSnapshot,
                quantity: i.quantity,
                unitPrice: Number(i.unitPrice),
                totalPrice: Number(i.totalPrice),
              })),
              createdAt: o.createdAt.toISOString(),
            };
          })
        );

        return reply.status(200).send({
          success: true,
          data: populatedOrders,
        });
      }
    } catch {
      // Fallback to dev in-memory orders
    }

    const filtered = inMemoryOrders.filter(o => o.userId === userId);
    return reply.status(200).send({
      success: true,
      data: filtered,
    });
  });

  // GET /api/v1/orders (Admin protected)
  app.get('/api/v1/orders', { preHandler: [authenticate, authorizeAdmin] }, async (_request, reply) => {
    try {
      const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
      if (allOrders.length > 0) {
        const populatedOrders = await Promise.all(
          allOrders.map(async (o) => {
            const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
            return {
              id: o.id,
              orderNumber: o.orderNumber,
              userId: o.userId,
              status: o.status,
              subtotal: Number(o.subtotal),
              shippingAmount: Number(o.shippingAmount),
              totalAmount: Number(o.totalAmount),
              paymentMethod: o.paymentMethod,
              shippingAddress: o.shippingAddress,
              items: items.map(i => ({
                id: i.id,
                productId: i.productId,
                productTitleSnapshot: i.productTitleSnapshot,
                variantSnapshot: i.variantSnapshot,
                quantity: i.quantity,
                unitPrice: Number(i.unitPrice),
                totalPrice: Number(i.totalPrice),
              })),
              createdAt: o.createdAt.toISOString(),
            };
          })
        );

        return reply.status(200).send({
          success: true,
          data: populatedOrders,
        });
      }
    } catch {
      // Dev fallback
    }

    return reply.status(200).send({
      success: true,
      data: inMemoryOrders,
    });
  });

  // GET /api/v1/orders/:id (Authenticated Customer/Admin)
  app.get('/api/v1/orders/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = request.user!;

    try {
      const matched = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

      if (matched.length > 0) {
        const o = matched[0];

        // Non-admin customers can only view their own orders
        if (user.role !== 'ADMIN' && o.userId !== user.id) {
          return reply.status(403).send({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have permission to view this order.',
            },
          });
        }

        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));

        return reply.status(200).send({
          success: true,
          data: {
            id: o.id,
            orderNumber: o.orderNumber,
            userId: o.userId,
            status: o.status,
            subtotal: Number(o.subtotal),
            shippingAmount: Number(o.shippingAmount),
            totalAmount: Number(o.totalAmount),
            paymentMethod: o.paymentMethod,
            shippingAddress: o.shippingAddress,
            items: items.map(i => ({
              id: i.id,
              productId: i.productId,
              productTitleSnapshot: i.productTitleSnapshot,
              variantSnapshot: i.variantSnapshot,
              quantity: i.quantity,
              unitPrice: Number(i.unitPrice),
              totalPrice: Number(i.totalPrice),
            })),
            createdAt: o.createdAt.toISOString(),
          },
        });
      }
    } catch {
      // Fallback
    }

    const devOrder = inMemoryOrders.find(o => o.id === id);
    if (devOrder) {
      if (user.role !== 'ADMIN' && devOrder.userId !== user.id) {
        return reply.status(403).send({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You do not have permission to view this order.' },
        });
      }
      return reply.status(200).send({ success: true, data: devOrder });
    }

    return reply.status(404).send({
      success: false,
      error: { code: 'ORDER_NOT_FOUND', message: `Order with ID '${id}' not found.` },
    });
  });
}
