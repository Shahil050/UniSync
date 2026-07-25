# FROM node:26-alpine AS deps
# # Install native build tools needed for node-gyp and Prisma compilation
# RUN apk add --no-cache libc6-compat python3 make g++
# RUN npm install -g pnpm
# WORKDIR /app

# COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
# RUN pnpm install --frozen-lockfile --ignore-scripts

# FROM node:26-alpine AS builder
# RUN npm install -g pnpm
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Mock Environment Variables to satisfy compilation steps
# ENV NEXT_DISABLE_STATIC_PAGES_BUILD=1
# ENV AUTH_SECRET="temporary-32-character-secret-for-building-only"
# ENV DATABASE_URL="postgresql://mock:mock@localhost:5432/mock"

# # 1. Generate the Prisma Client
# RUN pnpm exec prisma generate

# # 2. Run standard production build
# RUN pnpm run build

# # 3. Prune development dependencies to keep the image light
# RUN pnpm prune --prod

# FROM node:26-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Copy pruned node_modules, build artifacts, and application files
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# # Safely copy public folder only if it exists in the build stage
# COPY --from=builder --chown=nextjs:nodejs /app/publi[c] ./public

# USER nextjs

# EXPOSE 8000
# ENV PORT=8000
# ENV HOSTNAME="0.0.0.0"

# # Start the application using pnpm next start
# CMD ["pnpm", "run", "dev", "-p", "8000"]





FROM node:22-alpine

WORKDIR /app

# 1. Install build tools needed for Prisma/node-gyp compilation
RUN apk add --no-cache libc6-compat python3 make g++

# 2. Install pnpm globally in this runtime layer
RUN npm install -g pnpm

# 3. Copy manifests and package blueprints
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# 4. Install ALL dependencies (including devDependencies needed for pnpm dev)
RUN pnpm install

# 5. Copy your application code
COPY . .

# 6. Generate Prisma Client schemas automatically
RUN pnpm exec prisma generate

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# 7. Start the active dev engine directly
CMD ["pnpm", "run", "dev"]




# FROM node:26-alpine

# WORKDIR /app

# # 1. Install system tools
# RUN apk add --no-cache libc6-compat python3 make g++

# # 2. Install pnpm globally
# RUN npm install -g pnpm

# # 3. Copy manifests
# COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# # 4. Install dependencies while skipping the broken inotify compilation script
# RUN pnpm install --ignore-scripts

# # 5. Copy your application code
# COPY . .

# # 6. Explicitly run Prisma generation (bypasses the global ignore restriction)
# RUN pnpm exec prisma generate

# EXPOSE 8000
# ENV PORT=8000
# ENV HOSTNAME="0.0.0.0"

# CMD ["pnpm", "run", "dev"]