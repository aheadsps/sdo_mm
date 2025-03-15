FROM node:18-alpine

WORKDIR /app

COPY ./frontend/package.json .
COPY ./frontend/package-lock.json* .

RUN npm install

COPY ./frontend/ .

EXPOSE 5000

COPY ./frontend/docker/react/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start
