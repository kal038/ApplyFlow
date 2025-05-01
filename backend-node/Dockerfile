# Build stage: compile TypeScript
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy package.json files
COPY package*.json ./
COPY tsconfig*.json ./

# Install ALL dependencies (needed to compile)
RUN npm ci

# Copy the full source code
COPY . .

# Build TypeScript → outputs to dist/
RUN npm run build

# Runtime stage: run compiled JS
FROM node:20-slim AS runtime

WORKDIR /usr/src/app

# Copy ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy ONLY built code (no source, no configs, no node_modules from build stage)
COPY --from=builder /usr/src/app/dist ./dist

# Expose backend port
EXPOSE 3030

# Run compiled JS directly
CMD ["node", "dist/server.js"]
