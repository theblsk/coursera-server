FROM oven/bun:latest as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:slim

WORKDIR /app

# Copy production dependencies and build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start:prod"] 