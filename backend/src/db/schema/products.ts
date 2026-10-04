import { pgTable, varchar, text, numeric, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { categories } from './categories';

export const products = pgTable(
  'products',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    categoryId: varchar('category_id', { length: 100 }).references(() => categories.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    brand: varchar('brand', { length: 100 }),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric('original_price', { precision: 10, scale: 2 }),
    image: text('image').notNull(),
    ratingRate: numeric('rating_rate', { precision: 3, scale: 2 }).default('0.00'),
    ratingCount: integer('rating_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_products_category_id').on(table.categoryId),
    index('idx_products_title').on(table.title),
  ]
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
