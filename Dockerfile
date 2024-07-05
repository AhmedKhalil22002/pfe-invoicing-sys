# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG API_URL 
ENV API_URL ${API_URL}

RUN echo ${API_URL}

RUN yarn build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

RUN echo $NODE_ENV

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]