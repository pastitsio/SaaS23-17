FROM node:18-alpine


WORKDIR /usr/src/app
COPY package*.json .
RUN npm install

COPY . .
# RUN npbm ci --omit=dev

ARG APP_PORT
EXPOSE $APP_PORT
CMD ["npm", "start"]

# build image: 
# docker build --env-file .env -t userInfoManager .

# run image:
# docker run -d --env-file .env -p 8080:$APP_PORT userInfoManager
#      \ --network=saas23-17_default
#      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ [if run outside of docker-compose]
