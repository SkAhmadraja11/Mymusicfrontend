# -------- Stage 1: Build with Vite --------
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine 
# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy build output to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]