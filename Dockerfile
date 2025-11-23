FROM node:24-alpine as builder
WORKDIR /app
COPY . .

RUN npm i
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist/. /usr/share/nginx/html

EXPOSE 80