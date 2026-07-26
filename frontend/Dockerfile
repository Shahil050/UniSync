# FROM node:24-alpine AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# COPY unisync-frontend/package.json unisync-frontend/package-lock.json* ./
# RUN npm install

# FROM node:24-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY unisync-frontend .

# # Inject Backend API URL at build time
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ENV NEXT_PRIVATE_STANDALONE=true
# RUN npm run build

# FROM node:24-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# CMD ["node", "server.js"]




# FROM node:24-alpine AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# COPY unisync-frontend/package.json unisync-frontend/package-lock.json* ./
# RUN npm install

# FROM node:24-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY unisync-frontend .

# # Inject Backend API URL at build time
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ENV NEXT_PRIVATE_STANDALONE=true
# ENV NEXT_TELEMETRY_DISABLED=1

# # Clean build step (no inline npm installs needed)
# RUN npx next build --no-lint

# FROM node:24-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# CMD ["node", "server.js"]
# # test only
# CMD ["npm","run","dev"]



FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY unisync-frontend/package.json unisync-frontend/package-lock.json* ./
RUN npm install

# Copy application source code
COPY unisync-frontend .

# Pass build/environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

EXPOSE 3000

# Next.js flags: -H specifies the host binding, -p specifies the port
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]