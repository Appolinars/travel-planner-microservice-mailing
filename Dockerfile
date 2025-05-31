FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Expose the port your microservice listens on (e.g. 4000)
EXPOSE 4000

CMD ["node", "dist/main.js"]