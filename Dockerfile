FROM node:19.5.0

RUN mkdir /sdc-docker

ADD . /sdc-docker

WORKDIR /sdc-docker

RUN npm install --force

EXPOSE 8080

CMD ["node", "server/index.js"]