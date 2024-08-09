FROM node:18.20.3
    MAINTAINER Anant Sujatanagarjuna <anant.sujatanagarjuna@tu-clausthal.de>

WORKDIR /client

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD npm start
