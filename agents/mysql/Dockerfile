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

RUN apt-get update && apt-get install -y mysql-shell && rm -rf /var/lib/apt/lists/*

CMD ["node", "dist/index.js"]