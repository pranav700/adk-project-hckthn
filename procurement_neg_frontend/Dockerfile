FROM node:20-bullseye-slim

WORKDIR /app

COPY procurement_neg_frontend/package*.json ./
RUN npm install

# Copy the rest of the app
COPY procurement_neg_frontend/ ./

# 👇 Copy the env file into the build context
COPY procurement_neg_frontend/.env.production .env.production

# 👇 Show what's in the file for debug
RUN cat .env.production

# 👇 Build with env already present
RUN npm run build

EXPOSE 8080
ENV NODE_ENV=production
CMD ["npm", "start"]
