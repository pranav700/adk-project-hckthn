FROM node:20-bullseye-slim

WORKDIR /app

COPY procurement_neg_frontend/package*.json ./
RUN npm install

COPY procurement_neg_frontend/ ./

# 👇 Add this BEFORE build step to create .env.production.local
ARG NEXT_PUBLIC_BACKEND_API
RUN echo "NEXT_PUBLIC_BACKEND_API=$NEXT_PUBLIC_BACKEND_API" > .env.production.local

# 👇 Verify it's there
RUN cat .env.production.local

# Build step (Next.js will read from .env.production.local)
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
