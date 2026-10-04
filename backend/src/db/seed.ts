import { db, queryClient } from './index.js';
import { users, categories, products, productVariants } from './schema/index.js';
import { mockCategories, mockProducts } from '../data/mockCatalog.js';

export async function seedDatabase() {
  console.log('Seeding PostgreSQL database...');

  try {
    // 1. Seed Users
    console.log('Seeding initial users...');
    await db.insert(users).values([
      {
        id: 'usr-admin-1',
        email: 'admin@lumina.com',
        passwordHash: 'MOCK_HASH_ADMIN_PASS', // Real auth deferred to future phase
        fullName: 'Lumina Admin',
        role: 'ADMIN',
      },
      {
        id: 'usr-customer-1',
        email: 'customer@lumina.com',
        passwordHash: 'MOCK_HASH_CUSTOMER_PASS',
        fullName: 'Jane Doe',
        role: 'CUSTOMER',
      },
    ]).onConflictDoNothing();

    // 2. Seed Categories
    console.log('Seeding categories...');
    for (const cat of mockCategories) {
      await db.insert(categories).values({
        id: cat.id,
        name: cat.name,
        handle: cat.handle,
        description: cat.description || null,
        imageUrl: cat.image || null,
      }).onConflictDoNothing();
    }

    // 3. Seed Products & Variants
    console.log('Seeding products and variants...');
    for (const p of mockProducts) {
      const priceStr = Number(p.price).toFixed(2);
      const origPriceStr = p.original_price ? Number(p.original_price).toFixed(2) : null;
      const mainImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';
      const ratingRate = p.rating?.rate ? String(p.rating.rate) : '0.00';
      const ratingCount = p.rating?.count ? Number(p.rating.count) : 0;

      await db.insert(products).values({
        id: p.id,
        categoryId: p.category_id,
        title: p.name,
        brand: p.brand || 'Lumina',
        description: p.description || p.short_description || '',
        price: priceStr,
        originalPrice: origPriceStr,
        image: mainImage,
        ratingRate: ratingRate,
        ratingCount: ratingCount,
      }).onConflictDoNothing();

      // Create variants based on attributes
      const colors = p.attributes?.find(a => a.name.toLowerCase().includes('color'))?.options || [];
      const sizes = p.attributes?.find(a => a.name.toLowerCase().includes('size'))?.options || [];

      if (colors.length > 0 || sizes.length > 0) {
        const colorOpts = colors.length > 0 ? colors : [{ value: 'Default' }];
        const sizeOpts = sizes.length > 0 ? sizes : [{ value: 'One Size' }];

        let variantCount = 0;
        for (const col of colorOpts) {
          for (const siz of sizeOpts) {
            variantCount++;
            const sku = `${p.id}-${col.value.toLowerCase().replace(/[^a-z0-9]/g, '')}-${siz.value.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
            
            const optionsRecord: Record<string, string> = {};
            if (col.value !== 'Default') optionsRecord['Color'] = col.value;
            if (siz.value !== 'One Size') optionsRecord['Size'] = siz.value;

            await db.insert(productVariants).values({
              id: `var-${p.id}-${variantCount}`,
              productId: p.id,
              sku: sku,
              price: priceStr,
              stock: 25,
              image: mainImage,
              options: optionsRecord,
            }).onConflictDoNothing();
          }
        }
      } else {
        // Standard single variant
        await db.insert(productVariants).values({
          id: `var-${p.id}-default`,
          productId: p.id,
          sku: `${p.id}-default`,
          price: priceStr,
          stock: 50,
          image: mainImage,
          options: { Standard: 'Default' },
        }).onConflictDoNothing();
      }
    }

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => queryClient.end())
    .catch(() => process.exit(1));
}
