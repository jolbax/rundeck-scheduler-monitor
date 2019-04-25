require("dotenv").config();
const express = require("express");
const axios = require("axios");
const https = require("https");
const parseString = require("xml2js").parseString;
const app = express();

const RUNDECK_ACCESS_TOKEN = process.env.RUNDECK_ACCESS_TOKEN
const RUNDECK_API_BASE_URL = process.env.RUNDECK_API_BASE_URL
const HTTP_PORT = process.env.HTTP_PORT

const request = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

request.defaults.headers.common["Accept"] = "application/json";
request.defaults.headers.common["X-Rundeck-Auth-Token"] =
  RUNDECK_ACCESS_TOKEN;

app.set("views", "./views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  request
    .get(RUNDECK_API_BASE_URL + "projects")
    .then(result => {
      const projects = result.data;
      if (projects.length > 0) {
        req.params.projectName = projects[0].name;
        res.redirect(`/${projects[0].name}/show`);
      } else {
        res.render("index", {
          projects: [],
          selectedProject: "",
          schedules: []
        });
      }
    })
    .catch(err => {
      if (err.code === "ECONNREFUSED") {
        console.log("ECONNREFUSED");
      } else if (err.response.status === 403) {
        console.log("You don't have permission to access Rundeck website.");
      }
    });
});

app.get("/:projectName/show", (req, res) => {
  const projectName = req.params.projectName;
  let projects = [];
  Promise.all([
    request.get(RUNDECK_API_BASE_URL + "projects"),
    request.get(
      RUNDECK_API_BASE_URL +
        `project/${projectName}/jobs?scheduledFilter=true`
    )
  ])
    .then(info => {
      projects = info[0].data;
      let scheduledJobs = [];
      if (info[1].status === 200) {
        scheduledJobs = info[1].data.map(scheduled => {
          return Promise.all([
            request.get(
              RUNDECK_API_BASE_URL + "job/" + scheduled.id + "/info"
            ),
            request.get(
              RUNDECK_API_BASE_URL +
                "job/" +
                scheduled.id +
                "?format=xml"
            ),
            request.get(
              RUNDECK_API_BASE_URL +
                "job/" +
                scheduled.id +
                "/executions?offset=0&max=1"
            )
          ])
            .then(pmResult => {
              if (pmResult[0].data !== undefined) {
                scheduled.nextScheduledExecution = pmResult[0].data
                  .nextScheduledExecution
                  ? pmResult[0].data.nextScheduledExecution
                      .replace("T", " ")
                      .replace("Z", " ")
                  : "";
              }

              if (pmResult[1].data !== undefined) {
                let scheduledInfo;
                parseString(pmResult[1].data, (err, parseResult) => {
                  scheduledInfo = parseResult;
                });

                const scheduleExp = scheduledInfo.joblist.job[0].schedule[0];
                scheduled.schedule =
                  scheduleExp.time[0].$.seconds +
                  " " +
                  scheduleExp.time[0].$.minute +
                  " " +
                  scheduleExp.time[0].$.hour +
                  " " +
                  getDayScheduleExp(scheduleExp) +
                  " " +
                  scheduleExp.month[0].$.month +
                  " " +
                  scheduleExp.year[0].$.year;
              }

              if (pmResult[2].data !== undefined) {
                const executionsInfo = pmResult[2].data;
                if (executionsInfo !== undefined) {
                  scheduled.status = executionsInfo.executions[0].status;
                  scheduled.lastExecution = executionsInfo.executions[0][
                    "date-ended"
                  ]["date"]
                    ? executionsInfo.executions[0]["date-ended"]["date"]
                        .replace("T", " ")
                        .replace("Z", " ")
                    : "";
                }
              }
              return scheduled;
            })
            .catch(function(err) {
              console.log(err); // some coding error in handling happened
            });
        });
      }
      Promise.all(scheduledJobs).then(schedules => {
        res.render("index", {
          projects: projects,
          selectedProject: projectName,
          schedules: schedules
        });
      });
    })
    .catch(err => {
      if (err.code === "ECONNREFUSED") {
        console.log("ECONNREFUSED");
      } else if (err.response.status === 403) {
        console.log("You don't have permission to access Rundeck website.");
      }
    });
});

function getDayScheduleExp(scheduledExp) {
  if (scheduledExp.weekday !== undefined) {
    return scheduledExp.weekday[0].$.day;
  } else {
    return scheduledExp.dayofmonth[0] == "" ? "*" : scheduledExp.dayofmonth[0];
  }
}

app.listen(HTTP_PORT, () => {
  console.log(`Server is starting on port ${HTTP_PORT}`);
});
