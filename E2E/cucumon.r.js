const CucumerReporter = require("cucumon-reports/cucumber");
const fs = require('fs');
const path = require('path');

const emptyDirAsync = location => {
    fs.readdir(location, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(location, file), err => {
            if (err) throw err;
          });
        }
    });
}

const emptyDirSync = location => {
    const files = fs.readdirSync(location); 
    for (const file of files) {
        fs.unlinkSync(path.join(location, file));
    }
}

const cucumerReporteLocation = "cypress/reports/cucumber";
const cucumerReporter = new CucumerReporter(cucumerReporteLocation);

module.exports = {
    // common:{
    //     //dashboard: "https://cucumon-dashboard.com",
            // init: function() {},
            // end: function() {},
    // },
    // coverage:[
    //     {
    //         files: ["cypress/integration/features/payment/**/*.feature" ],
    //         threshold: 98
    //     },{
    //         tagExpression: "@non-connected && @premium",
    //         //binary: true
    //     },{
    //         threshold: 50
    //     }
    // ],
    reports: [{
        hooks:[{
            when: "after",
            for: "feature",
            handler: cucumerReporter.report,
            ref: cucumerReporter
        }],
        init: function(){
            emptyDirSync(cucumerReporteLocation);
            console.log("It'll be logged in the starting of tests");
        },
        end: function(){
            console.log("It'll be logged in the ending of tests");
        }
    }]
}