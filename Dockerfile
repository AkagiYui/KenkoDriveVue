FROM node:18 as builder
COPY . /app

RUN npm config set registry https://registry.npmmirror.com \
&& npm config set disturl https://npmmirror.com/dist --location=global \
&& npm i --location=global pnpm

WORKDIR /app
RUN pnpm install \
&& pnpm build

FROM caddy:alpine
COPY Caddyfile /etc/caddy
COPY dist /www
