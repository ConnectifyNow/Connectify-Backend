FROM node:18

WORKDIR /src/app

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

COPY .env .env

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prod"]
