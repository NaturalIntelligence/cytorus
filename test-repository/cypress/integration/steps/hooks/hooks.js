////const cucumberReporter = require("cytorus-reports/cucumber");
const {cliLog } = require("cytorus/Tasks")
//After("feature", feature => {
//})

//Using a mocha test directly
before(() => {
    cliLog("Before hook ");
    console.log("Running from test");
})
beforeEach(() => {
    cliLog("BeforeEach hook");
    console.log("Running from test: before each");
})
// beforeEachFeature( () => {
//     cliLog("Before feature hook 1");
//     console.log("Before feature hook 1")
//     cy.log("Before feature hook 1")
// });
// beforeEachFeature( () => {
//     cliLog("Before feature hook 2");
//     console.log("Before feature hook 2")
//     cy.log("Before feature hook 2")
// });
// beforeEachScenario(() => {
//     cliLog("Before scenario hook 1");
//     console.log("Before scenario hook 1")
//     cy.log("Before scenario hook 1")
// })
// beforeEachScenario(() => {
//     cliLog("Before scenario hook 2");
//     console.log("Before scenario hook 2")
//     cy.log("Before scenario hook 2")
// })
// Before("feature", result => {
//     cliLog("Before feature hook 2");
//     console.log("Before feature hook 2")
// })
// After("feature", result => {
//     console.log("After feature hook 1")
//     cliLog("After feature hook 1")
// })
// After("feature", result => {
//     console.log("After feature hook 2")
//     cliLog("After feature hook 2")
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