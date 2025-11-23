FROM node:24-alpine as builder
WORKDIR /app
COPY . .

RUN npm i
RUN npm run build

FROM nginx:stable-alpine

ARG API_HOST
ARG VERSION

ENV VITE_API_HOST=$API_HOST
ENV VITE_VERSION=$VERSION

COPY --from=builder /app/dist/. /usr/share/nginx/html

EXPOSE 80