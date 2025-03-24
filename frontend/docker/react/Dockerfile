FROM node:20-alpine
RUN mkdir /app
WORKDIR /app
COPY ./frontend/package.json /app
COPY ./frontend/package-lock.json* /app
RUN apk update && apk add curl
COPY ./frontend/docker/react/start /app/start
RUN sed -i 's/\r$//g' /app/start
RUN chmod +x /app/start
RUN cd /app && npm install
EXPOSE 5173


