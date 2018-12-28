FROM node:10.12.0-alpine

RUN mkdir -p /usr/src/app_frontend
WORKDIR /usr/src/app_frontend
ENV HOST 0.0.0.0

RUN apk update && \
    apk add curl curl-dev jq bash && \
    npm install -g npm&& \
    npm install -g @vue/cli&& \
    npm install -g npm install xlsx

RUN npm install -g @vue/cli-service-global@3.0.4

COPY package*.json ./

RUN npm install

