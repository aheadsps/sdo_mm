FROM node:20-alpine
RUN mkdir /app
WORKDIR /app
#COPY ./frontend/package.json /app
#COPY ./frontend/package-lock.json* /app
RUN apk update && apk add curl
COPY ./frontend/docker/react/start /app/start
COPY ./frontend/docker/react/conf/ /app/
RUN sed -i 's/\r$//g' /app/start
RUN chmod +x /app/start
RUN cd /app && npm install
#COPY ./frontend/ .
EXPOSE 5173
#CMD ["ash -x /app/start"]

