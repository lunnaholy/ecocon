FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build


FROM nginx:stable-alpine AS prod

WORKDIR /usr/src/app

COPY nginx /etc/nginx/conf.d
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
