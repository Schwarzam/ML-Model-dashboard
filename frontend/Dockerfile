FROM node:16-alpine
WORKDIR /frontend
RUN rm -rf ./*
COPY . .
RUN npm i
RUN npm run build