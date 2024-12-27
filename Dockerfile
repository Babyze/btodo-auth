FROM node:latest

WORKDIR /usr/apps/auth-service

COPY ./  ./

RUN npm run install-all