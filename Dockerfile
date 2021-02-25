FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --silent

COPY . ./

EXPOSE 4901 

ENV REDIS_HOST=redis

CMD ["npm", "start"]
