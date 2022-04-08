FROM alpine:latest
#FROM node:16.3.1
ENV ENVI=production
WORKDIR /usr/src/app

COPY . .

RUN if [[ ! -z $NODE_ENV ]]; then set ENVI="$NODE_ENV"; fi; echo $ENVI > test.txt;

RUN chmod +x ./docker/entrypoint.sh
#RUN apk add dumb-init

#COPY --chown=node:node package*.json ./

#RUN npm ci --only=production

#COPY --chown=node:node . .

#USER node

#EXPOSE 8080

ENTRYPOINT ["./docker/entrypoint.sh"]
