FROM node:16.16.0-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run-script build-prod
FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /app/www/ /usr/share/nginx/html
EXPOSE 80

