# Etapa 1: build de producción con Node
FROM node:22-alpine AS build
WORKDIR /app

COPY . .
RUN npm ci

ARG API_URL=http://localhost:5198/api
ARG ASSET_BASE_URL=http://localhost:5198
ENV API_URL=$API_URL
ENV ASSET_BASE_URL=$ASSET_BASE_URL

RUN npm run build

# Etapa 2: servir el build estático (dist/spa) con Nginx sin privilegios
FROM nginxinc/nginx-unprivileged:1.27-alpine AS final

COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
