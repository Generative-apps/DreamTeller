FROM nginx:1.25.1-alpine-slim

COPY ./default /etc/nginx/conf.d/default.conf
COPY ./default /etc/nginx/sites-available/default

RUN mkdir /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



