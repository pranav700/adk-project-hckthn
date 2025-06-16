FROM node:20-bullseye-slim

WORKDIR /app

COPY procurement_neg_frontend/package*.json ./
RUN npm install --production

COPY procurement_neg_frontend/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
