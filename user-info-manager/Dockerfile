FROM node:18-alpine
RUN apk update
RUN apk --no-cache add \
    bash \
    ca-certificates \
    lz4-dev \
    musl-dev \
    cyrus-sasl-dev \
    openssl-dev \
    librdkafka-dev=1.9.2-r0 \
    make \
    g++ \
    python3  

WORKDIR /usr/src/app/user-info-manager/
COPY package*.json .
RUN npm install

WORKDIR /usr/src/app/choreographer/
COPY ./kafka/package*.json .
RUN npm install

WORKDIR /usr/src/app/
COPY . ./user-info-manager/
COPY ./kafka ./choreographer/kafka/
COPY ./models/KafkaEvent* ./choreographer/models/

WORKDIR /usr/src/app/user-info-manager/
ENV NODE_ENV=production
EXPOSE $APP_PORT
CMD ["npm", "start"]

# build image: 
# docker build --env-file .env -t userInfoManager .

# run image:
# docker run -d --env-file .env -p 8080:$APP_PORT userInfoManager