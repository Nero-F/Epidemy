FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./

ENV REDIS_HOST=redis

EXPOSE 3001

CMD ["npm", "start"]
