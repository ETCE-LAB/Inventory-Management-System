FROM node:18.20.3
    MAINTAINER Anant Sujatanagarjuna <anant.sujatanagarjuna@tu-clausthal.de>

WORKDIR /server

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

ENV MONGO_URL="mongodb://10.43.109.8/inventory-management"
CMD npm start
