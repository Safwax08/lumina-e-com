import { pgTable, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const categories = pgTable(
  'categories',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    handle: varchar('handle', { length: 100 }).notNull().unique(),
    description: text('description'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_categories_handle').on(table.handle),
  ]
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
