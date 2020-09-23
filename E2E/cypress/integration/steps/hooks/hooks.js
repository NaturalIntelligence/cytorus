//const cucumberReporter = require("cytorus-reports/cucumber");
const {FNs: _F} = require("cytorus/Constants")
//After("feature", feature => {
//})
Before("feature", result => {
    _F.debug_cy("Before feature hook 1");
    console.log("Before feature hook 1")
})
Before("feature", result => {
    _F.debug_cy("Before feature hook 2");
    console.log("Before feature hook 2")
})
After("feature", result => {
    console.log("After feature hook 1")
    _F.debug_cy("After feature hook 1")
})
After("feature", result => {
    console.log("After feature hook 2")
    _F.debug_cy("After feature hook 2")
})
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