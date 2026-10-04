import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required.'),
  variantId: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be at least 1.'),
});

export const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Recipient name is required.'),
  email: z.string().email('Invalid email address format.'),
  address: z.string().min(1, 'Shipping address is required.'),
  city: z.string().min(1, 'City is required.'),
  zip: z.string().min(1, 'Postal code is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, 'Order must contain at least one item.'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required.'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
