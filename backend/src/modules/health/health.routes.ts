import { FastifyInstance } from 'fastify';
import { queryClient } from '../../db/index.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/v1/health', async (_request, reply) => {
    let dbStatus = 'disconnected';
    
    try {
      // Test quick DB query
      await queryClient`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'unreachable_or_unconfigured';
    }

    return reply.status(200).send({
      success: true,
      data: {
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
    });
  });
}
