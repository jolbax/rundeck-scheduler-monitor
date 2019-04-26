# README #

### Quick overview ###

This is a simple web page to show Rundeck scheduled jobs data, such as job name, schedule, last execution, next execution.

Data are fetched via Rundeck API.
 
This web page already be dockerized. 
### Libraries ###

* NodeJS
* EJS 
* Bootstrap

### Configuration file ###
.env file:
```xml
HTTP_PORT=5000
RUNDECK_ACCESS_TOKEN='topsecret'
RUNDECK_API_BASE_URL='https://127.0.0.1/api/21/'
TIMEZONE='+2'
```

### References ###
https://axiconsumer.atlassian.net/wiki/spaces/ICT/pages/607682563/Web+page+for+Rundeck+scheduled+jobs+monitoring