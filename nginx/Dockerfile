# Nginx Dockerfile

# FROM debian:jessie

# ENV NGINX_VERSION 1.11.1-1~jessie

# RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
#     && echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
#     && apt-get update \
#     && apt-get install --no-install-recommends --no-install-suggests -y \
#                         ca-certificates \
#                         nginx=${NGINX_VERSION} \
#                         gettext-base \
#     && rm -rf /var/lib/apt/lists/*

# RUN apt-get update && apt-get -y upgrade && apt-get install -y build-essential libssl-dev libreadline-dev zlib1g-dev task-japanese sudo
# RUN apt-get -y install openssh-server ufw curl

FROM nginx:latest
 
RUN apt-get update && apt-get install -y \
    openssl \
    ssl-cert \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
 
# COPY ./conf.d/ssl.conf /etc/nginx/conf.d/


RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

