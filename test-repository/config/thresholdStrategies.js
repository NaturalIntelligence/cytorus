
module.exports = [{
    //No test with @skip tag should run
    tagExpression: "@invalid",
    //max: 0
}, {
    //No test with @skip tag should run
    tagExpression: "@skip",
    max: 0
},{
    file: "dataConverter.feature",
    //passed: [1,2.1, 2.2, 4]
    pass: [1,2.1, 2.2, 4]
},{
    file: "features/nested/dynamicArguments.feature",
    min: "100%"
},{
    file: "integration/features/failing.feature",
    pass: [2],
    fail: [1,3,4]
},{
    file: "cypress/integration/features/google.feature",
    pass: [1],
    //fail: [1] //since scenario 1 is skipped. This strategy will fail
},{
    file: "cypress/integration/features/google2.feature",
    min: 1
},{
    //all the scenarios are skipped for this
    file: "math.feature",
    max: "0%" //this will pass 
    //min: "0%" //this will pass
},{
    file: "parameters.feature",
    //max: "10%", //will fail
    min: "90%"
},{
    file: "sections.feature",
    min: "100%"
},{
    file: "SyntaxError.feature", //not parsed
    max: 1 //invalid but not fail as this file doesn't exist
},{
    file: "SyntaxError.feature", //not parsed
    max: "1%" //invalid but not fail
// },{
//     file: "SyntaxError.feature", //not parsed
//     min: 1 //should fail
// },{
//     file: "SyntaxError.feature", //not parsed
//     min: "1%" //should fail
},{
    file: "tags.feature",
    pass: [2]
},{
    tagExpression: "@all",
    min: "100%"
},{
    tagExpression: "@doesNotExist",
    //min: "100%" //will fail
    max: 0
},{
    tagExpression: "@doesNotExist",
    //min: "100%" //will fail
    max: 0
},{
    min: "50%"
}]