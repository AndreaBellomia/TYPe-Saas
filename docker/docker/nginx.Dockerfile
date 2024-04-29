FROM nginx:1.21-alpine

ARG CONFNAME

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/${CONFNAME}.conf /etc/nginx/conf.d/nginx.conf
