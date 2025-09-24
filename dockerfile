# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install git and required dependencies
RUN apk add --no-cache git

# Clone your frontend repo
RUN git clone https://github.com/SkAhmadraja11/SDPfrontend.git .

# Install dependencies as root first
RUN npm install -g vite
RUN npm install

# Set permissions and switch to node user
RUN chown -R node:node /app
RUN chmod -R 755 /app
USER node

# Run build as node user
RUN npm run build

# -------- Run stage --------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]