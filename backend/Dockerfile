# FROM node:20-alpine AS deps
# RUN apk add --no-cache libc6-compat
# RUN npm install -g pnpm
# WORKDIR /app

# COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
# RUN pnpm install --frozen-lockfile

# FROM node:20-alpine AS builder
# RUN npm install -g pnpm
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV NEXT_PRIVATE_STANDALONE=true
# RUN npm run build

# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# # CHANGE PORT TO 8000 FOR BACKEND
# EXPOSE 8000
# ENV PORT=8000
# ENV HOSTNAME="0.0.0.0"

# CMD ["node", "server.js"]






FROM node:20-alpine AS deps
# Install native build tools needed for node-gyp and inotify compilation
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# If your backend generates Prisma engines or client builds, make sure you copy them over
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Adjust this command if you launch using a standard node process instead of next
CMD ["node", "dist/server.js"]