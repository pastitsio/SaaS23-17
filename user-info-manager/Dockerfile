FROM node:18
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE $APP_PORT
CMD ["npm", "start"]

# build image: 
# docker build --env-file .env -t userInfoManager .

# run image:
# docker run -d --env-file .env -p 8080:$APP_PORT userInfoManager