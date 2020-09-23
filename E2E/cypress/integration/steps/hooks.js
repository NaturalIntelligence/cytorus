//const cucumberReporter = require("cytorus-reports/cucumber");
const path = require("path");
const cucumberReportDir = path.join( __projRootDir, "cypress/integration/cucumber-reports" );
const fs = require("fs");

//After("feature", feature => {
    //clearDir(cucumberReportDir);
    //const reportPath = path.join(cucumberReportDir, path.basename(feature.fileName, ".feature") + ".json");
    //const reportData = cucumberReporter(feature);
    //cy.writeFile(reportPath , reportData , { log: false } );
//})
// Before("feature", result => {
//     console.log("Before feature")
// })
// Before("suit", result => {
//     console.log("Before suit")
// })

// After("suit", result => {
//     console.log("After suit")
// })
// Before("scenario", result => {
//     console.log("Before scenario")
// })

// After("scenario", result => {
//     console.log("After scenario")
// })
// Before("step", result => {
//     console.log("Before step")
// })

// After("step", result => {
//     console.log("After step")
// })