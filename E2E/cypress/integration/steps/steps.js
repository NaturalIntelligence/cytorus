const { findStepDef } = require("../../../../src/Repository");

step('I start here', function() {
    //do nothing
});

step(/this scenario should work fine/, function() {
    //do nothing
});

step(/I leave some error/, function() {
    fs.readFile("some file");
});

step(/I throw some error/, function() {
    throw new Error("on my wish");
});

