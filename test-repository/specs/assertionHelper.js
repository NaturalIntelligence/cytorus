const fs = require('fs');
const path = require('path');

module.exports.shouldNotBeSkipped = function(arr){
    verifyNotSkipped(arr, true);
}
module.exports.shouldBeSkipped = function(arr){
    verifyNotSkipped(arr, false);
}
function verifyNotSkipped(arr, shouldRun){
    //read all the minimal reports
    const minimalResultPath = path.join( process.cwd(), ".cytorus/result/minimal");
    const files = fs.readdirSync(minimalResultPath); 
        for (let i = 0; i < files.length; i++) {
            const file = path.join(minimalResultPath, files[i]);
            const feature = require( file );
            
            for (let i = 0; i < arr.length; i++) {
                const scenario = feature.scenarios[arr[i] - 1];
                const status = scenario.status;
        
                if(status === "skipped"){
                    if(shouldRun){
                        throw new Error("Expected "+ arr[i] +" not to be skipped.");
                    }
                }else{
                    if(!shouldRun) {
                        throw new Error("Expected "+ arr[i] +" to be skipped.");
                    }
                }
            }
        }
}
