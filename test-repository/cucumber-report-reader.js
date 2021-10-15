var reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

//TODO: ensure that `cypress/reports/cucumber` exist. otherwise either create it or empty it

const reportLocation = 'cypress/reports/cucumber/single';

if(fs.existsSync(reportLocation)){
    emptyDirSync(reportLocation);
}else{
    fs.mkdirSync(reportLocation, {recursive: true});
}

var options = {
        theme: 'bootstrap',
        //jsonFile: 'cypress/reports/cucumber/dataConverter.json',
        jsonDir: '.cytorus/reports/cucumber',
        //jsonDir: 'cypress/report',
        output: reportLocation + '/cucumber_report.html',
        reportSuiteAsScenarios: true,
        launchReport: true,
        metadata: {
            "App Version":"0.3.2",
            "Test Environment": "DEVELOPEMENT",
            "Browser": "Chrome  54.0.2840.98",
            "Platform": "Linux",
            "Parallel": "Scenarios",
            "Executed": "Remote"
        }
    };
 
reporter.generate(options);

function emptyDirSync(location){
    const files = fs.readdirSync(location); 
    for (const file of files) {
        fs.unlinkSync(path.join(location, file));
    }
}