# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

# Runtime stage
FROM node:20-slim

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package.json ./

CMD ["node", "dist/index.js"]