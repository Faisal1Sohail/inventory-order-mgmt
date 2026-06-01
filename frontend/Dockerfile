# ==========================================================
# STAGE 1: Build (Compile Vite + React static assets)
# ==========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Enable high-speed installs
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy codebase and compile product bundle
COPY . .
RUN npm run build

# ==========================================================
# STAGE 2: Web Server (Serve SPA statically via Nginx)
# ==========================================================
FROM nginx:1.25-alpine

# Copy compilation bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default configuration with production Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
