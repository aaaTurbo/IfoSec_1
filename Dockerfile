ARG NODE_VERSION=20.16

FROM node:${NODE_VERSION} AS start_prod

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "modules/Application.js"]