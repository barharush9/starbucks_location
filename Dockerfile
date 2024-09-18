# Dockerfile

FROM node:latest

WORKDIR /src/app

COPY Server/package*.json ./

RUN npm install

COPY Server/ /src/app/Server/
COPY Client/ /src/app/Client/

RUN echo "Contents of /src/app:" && ls -la /src/app
RUN echo "Contents of /src/app/Server:" && ls -la /src/app/Server
RUN echo "Contents of /src/app/Server/app:" && ls -la /src/app/Server/app
RUN echo "Contents of /src/app/Client:" && ls -la /src/app/Client
RUN echo "Contents of /src/app/Client/images:" && ls -la /src/app/Client/images

CMD ["node", "Server/app/server.js"]
