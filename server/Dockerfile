FROM node:18.20.3
    MAINTAINER Anant Sujatanagarjuna <anant.sujatanagarjuna@tu-clausthal.de>

WORKDIR /server

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

<<<<<<< HEAD
=======
ENV MONGO_URL="mongodb://10.0.0.104:27017/"

>>>>>>> dda955d (Add CICD pipeline)
CMD npm start
