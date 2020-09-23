var reporter = require('cucumber-html-reporter');
 
var options = {
        theme: 'bootstrap',
        //jsonFile: 'cypress/reports/cucumber/dataConverter.json',
        jsonDir: 'cypress/reports/cucumber',
        output: 'cypress/reports/cucumber/cucumber_report.html',
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