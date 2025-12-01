# Multi-stage build for backend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN yarn install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source files
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build application
RUN yarn build

# Production stage
FROM base AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/package.json ./

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Run migrations, seed, and start application
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn prisma db seed && node dist/main"]
