FROM node:11.9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV HTTP_PORT=8080
ENV RUNDECK_ACCESS_TOKEN=''
ENV RUNDECK_API_BASE_URL=''
# Europe-Zurich: +2
ENV TIMEZONE='+2'

CMD [ "npm", "start" ]