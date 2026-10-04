import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.').max(1000, 'Message is too long (max 1000 characters).'),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
