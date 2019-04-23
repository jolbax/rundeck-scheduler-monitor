# README #

### Quick overview ###

This is a simple web page to show Rundeck scheduled jobs data, such as job name, schedule, last execution, next execution.

Data are fetched via Rundeck API
 

### Libraries ###

* NodeJS
* EJS 
* Bootstrap

### Configuration file ###
config/rundeck-api-config.js
```xml
module.exports = {
	HTTP_PORT: 5000,
	RUNDECK_ACCESS_TOKEN: 'XXXXXXXXXXXXXXX',
	RUNDECK_API_BASE_URL: 'http://127.0.0.1:8080/api/21/'
}
```

### Build & start ###
```xml
npm install  // only run once
npm start
```

### References ###
https://axiconsumer.atlassian.net/wiki/spaces/ICT/pages/607682563/Web+page+for+Rundeck+scheduled+jobs+monitoring