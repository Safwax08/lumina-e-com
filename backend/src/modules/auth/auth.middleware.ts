import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthUserPayload } from './auth.schema.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    // 1. Try reading token from HTTP-only cookie
    let token = request.cookies?.token;

    // 2. Fallback to Authorization Header if cookie absent
    if (!token && request.headers.authorization) {
      const parts = request.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required. Please log in to proceed.',
        },
      });
    }

    const payload = await request.server.jwt.verify<AuthUserPayload>(token);
    request.user = payload;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired session. Please log in again.',
      },
    });
  }
}

export async function authorizeAdmin(request: FastifyRequest, reply: FastifyReply) {
  // Ensure user is authenticated first
  if (!request.user) {
    return reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Authentication required.',
      },
    });
  }

  if (request.user.role !== 'ADMIN') {
    return reply.status(403).send({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Administrative privileges are required.',
      },
    });
  }
}
