const CucumerReporter = require("cucumon-reports/cucumber");
const fs = require('fs');
const path = require('path');

const emptyDirSync = location => {
    const files = fs.readdirSync(location); 
    for (const file of files) {
        fs.unlinkSync(path.join(location, file));
    }
}

const cucumerReportsPath = "cypress/reports/cucumber";
const cucumerReporter = new CucumerReporter(cucumerReportsPath);

module.exports = {
    init: function(){
        emptyDirSync(cucumerReportsPath);
    },
    end: async function(){
        await cucumerReporter.report();
    },
    success:[{
            tagExpression: "@non-connected && @premium",
        },{
            threshold: 50
        }]
}