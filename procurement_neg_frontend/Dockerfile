FROM node:20-bullseye-slim

WORKDIR /app

COPY procurement_neg_frontend/package*.json ./
RUN npm install

# Copy the rest of the app
COPY procurement_neg_frontend/ ./

# Copy the env file into the build context
ARG NEXT_PUBLIC_BACKEND_API 
RUN echo "NEXT_PUBLIC_BACKEND_API=$NEXT_PUBLIC_BACKEND_API" > .env
# Show what's in the file for debug
RUN cat .env

# Build with env already present
RUN npm run build

EXPOSE 8080 3000
#ENV NODE_ENV=production
CMD ["npm", "run", "dev"]
