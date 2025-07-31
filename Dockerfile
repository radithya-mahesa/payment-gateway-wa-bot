FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm audit fix

COPY . .

CMD ["node", "index.js"]
