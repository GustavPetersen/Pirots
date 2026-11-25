# Base dependencies
FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Development build and serve
FROM base AS development
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build (Vite inlines VITE_* vars at build time)
FROM base AS build
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

# Production serve: vite preview on its default port (4173)
FROM build AS production
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
