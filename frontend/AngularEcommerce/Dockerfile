# Stage 1
FROM node:14.15.4 as builder
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm install @popperjs/core --save
RUN npm run build

FROM nginx:1.17
COPY --from=builder /usr/src/app/dist/angular-ecommerce /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
