
const generateCucumberReport = require('./config/cucumberReport');
const localApp = require("./local-app/server");
module.exports = {
    runConfig: {
        docker: {
            //env: [ "CYPRESS_RECORD_KEY",  "CYPRESS_VIDEO" ],
            //env: [ "ELECTRON_RUN_AS_NODE"],
            //env: [ "DISPLAY"],
            args : {
                "--network": "host"
            },
            // "cypress" : "7.3.0",
        },
        tian: {
            url: "http://localhost:3377/api/projects/articlestack-chrome/builds"
        },
    },
    init: async function(){
        //start your application or poll if it starts before initiating tests
        localApp.listen( 3332, "localhost", () =>{
            console.log("Local application started on port 3332");
        })
    },
    end: async function(){
        localApp.close();
        await generateCucumberReport();
    },
    threshold: require("./config/thresholdStrategies")
}
