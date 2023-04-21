FROM node:latest

RUN mkdir /out
WORKDIR /out
COPY . .

RUN npm install

ENTRYPOINT npm run serve

EXPOSE 3000