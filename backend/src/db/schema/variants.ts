import { pgTable, varchar, text, numeric, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { products } from './products';

export const productVariants = pgTable(
  'product_variants',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    productId: varchar('product_id', { length: 100 }).notNull().references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }).notNull().unique(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull().default(0),
    image: text('image'),
    options: jsonb('options').$type<Record<string, string>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_product_variants_product_id').on(table.productId),
    index('idx_product_variants_sku').on(table.sku),
  ]
);

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
