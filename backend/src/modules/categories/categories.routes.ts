import { FastifyInstance } from 'fastify';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema/index.js';
import { mockCategories } from '../../data/mockCatalog.js';

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/api/v1/categories', async (_request, reply) => {
    try {
      const result = await db.select().from(categories);
      if (result && result.length > 0) {
        return reply.status(200).send({
          success: true,
          data: result.map(c => ({
            id: c.id,
            name: c.name,
            handle: c.handle,
            description: c.description || '',
            image: c.imageUrl || '',
          })),
        });
      }
    } catch {
      // Fallback to in-memory mock catalog if database connection is unconfigured/offline
    }

    // In-memory fallback dataset
    return reply.status(200).send({
      success: true,
      data: mockCategories.map(c => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        description: c.description || '',
        image: c.image || '',
      })),
    });
  });
}
