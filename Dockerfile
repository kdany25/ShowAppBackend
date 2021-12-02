# specify the node base image with your desired version node:<version>
FROM node:16-alpine3.12

WORKDIR ./

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

#ARG
ARG POSTGRES_PORT
ARG POSTGRES_HOST
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

ENV POSTGRES_PORT=${POSTGRES_PORT}
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DATABASE}

EXPOSE 3000

CMD echo "POSTGRES_PORT=${POSTGRES_PORT}" > .env \
  && echo "POSTGRES_HOST=${POSTGRES_HOST}" >> .env \
  && echo "POSTGRES_USER=${POSTGRES_USER}" >> .env \
  && echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" >> .env \
  && echo "POSTGRES_DB=${POSTGRES_DB}" >> .env \
  && npm run start:dev


