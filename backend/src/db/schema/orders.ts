import { pgTable, varchar, text, numeric, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { products } from './products';

export const orders = pgTable(
  'orders',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
    userId: varchar('user_id', { length: 100 }).references(() => users.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 50 }).notNull().default('PENDING'),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    shippingAmount: numeric('shipping_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
    shippingAddress: jsonb('shipping_address').notNull().$type<{
      name: string;
      email: string;
      address: string;
      city: string;
      zip: string;
      phone: string;
    }>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_orders_user_id').on(table.userId),
    index('idx_orders_created_at').on(table.createdAt),
  ]
);

export const orderItems = pgTable(
  'order_items',
  {
    id: varchar('id', { length: 100 }).primaryKey(),
    orderId: varchar('order_id', { length: 100 }).notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: varchar('product_id', { length: 100 }).references(() => products.id, { onDelete: 'set null' }),
    productTitleSnapshot: varchar('product_title_snapshot', { length: 255 }).notNull(),
    variantSnapshot: jsonb('variant_snapshot').$type<Record<string, unknown>>(),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_order_items_order_id').on(table.orderId),
  ]
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
