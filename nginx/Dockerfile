FROM nginx:latest
 
RUN apt-get update && apt-get install -y \
    openssl \
    ssl-cert \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

