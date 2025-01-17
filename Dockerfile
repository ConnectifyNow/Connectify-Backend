FROM node:18

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY .env .env

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
