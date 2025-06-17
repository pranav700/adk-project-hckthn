FROM node:20-bullseye-slim

WORKDIR /app

COPY procurement_neg_frontend/package*.json ./
RUN npm install

COPY procurement_neg_frontend/ .

RUN npm run build

ENV NODE_ENV=production

ARG NEXT_PUBLIC_BACKEND_API
ENV NEXT_PUBLIC_BACKEND_API=$NEXT_PUBLIC_BACKEND_API



EXPOSE 3000

CMD ["npm", "start"]
