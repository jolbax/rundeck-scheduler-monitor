FROM node:11.9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV HTTP_PORT=8080
ENV RUNDECK_ACCESS_TOKEN='9jkfFIB3D5mmnM8BTv4Jbbscqtlhe386'
ENV RUNDECK_API_BASE_URL='https://rundeck01.axoninsight.net/api/21/'
ENV TIMEZONE='+2'

CMD [ "npm", "start" ]