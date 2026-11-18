# Base dependencies
FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Development build and serve
FROM base AS development
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build
FROM base AS build
COPY . .
RUN npm run build
