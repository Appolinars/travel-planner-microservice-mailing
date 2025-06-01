########################
# 1) Builder stage
########################
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1a) Copy package.json & package-lock.json (or yarn.lock)
COPY package*.json ./

# 1b) Install everything (dev + prod), so that `nest` is available
RUN npm install

# 1c) Copy the rest of your source code
COPY . .

# 1d) Run the Nest build (now `nest` is on PATH)
RUN npm run build


########################
# 2) Runner stage
########################
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# 2a) Copy only the compiled output (dist/) and the production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# 2b) Expose the port (if you expose an HTTP endpoint)
#     In your case, you only create an RMQ microservice, but 
#     if you add a health-check HTTP server, pick its port here.
EXPOSE 4000

# 2c) Start the microservice (listening on RMQ transport)
CMD ["node", "dist/main.js"]