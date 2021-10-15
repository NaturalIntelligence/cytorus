const CucumerReporter = require("cytorus-reporter/cucumber");
const fs = require('fs');
const path = require('path');
const paths = require('cytorus/paths');

async function generateReport(){
    const cucumerReportsPath = ".cytorus/reports/cucumber";
    if( fs.existsSync(cucumerReportsPath)){
        emptyDirSync(cucumerReportsPath);
    }else{
        fs.mkdirSync( cucumerReportsPath, { recursive: true});
    }

    const sourcePath =  path.join(  __dirname, "../" ,paths.features ) ;
    const jsonDir =  path.join(  __dirname, "../" , paths.report.detailed);
    const cucumerReporter = new CucumerReporter(cucumerReportsPath, sourcePath, jsonDir);
    await cucumerReporter.report();
}

const emptyDirSync = location => {
    const files = fs.readdirSync(location); 
    for (const file of files) {
        fs.unlinkSync(path.join(location, file));
    }
}

module.exports = generateReport;