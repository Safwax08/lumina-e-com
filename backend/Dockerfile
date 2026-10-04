# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy configuration and source files
COPY tsconfig.json ./
COPY src ./src
COPY drizzle ./drizzle

# Build TypeScript code to dist/
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy dependency manifests and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled dist and drizzle migration files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Run as non-root user for security
USER node

# Expose backend API port
EXPOSE 4000

# Run migrations, seed admin account, and start Fastify server
CMD ["sh", "-c", "node dist/db/migrate.js && node dist/db/seedAdmin.js && node dist/server.js"]
