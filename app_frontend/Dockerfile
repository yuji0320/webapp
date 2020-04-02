FROM node:10.12.0-alpine

RUN mkdir -p /usr/src/app_frontend
WORKDIR /usr/src/app_frontend
ENV HOST 0.0.0.0

RUN apk update && \
    apk add curl curl-dev jq bash && \
    npm install -g npm&& \
    npm uninstall -g vue-cli&& \
    npm install -g @vue/cli&& \
    npm install -g npm install xlsx&& \
    npm install pdfmake

RUN npm install -g @vue/cli-service-global

COPY package*.json ./

RUN npm install

CMD /bin/bash
