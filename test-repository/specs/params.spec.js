const runCytorus = require("./runCytorus");
const assert = require('chai').assert;
const datahelper = require('./datahelper');


describe("cytorus", () => {
    describe("supports parameter types", function() {
        this.timeout(15000);

        it("should run tests including steps that use built-in parameter types without error", async function(){
            const expected = {
                passed: 1,                 failed: 0,
                missing: 0,                skipped: 0 // should be 1 (feature file has 2 tests)
            };
            await runCytorus(
                ["--tags", "'@params and @builtin'",
                 "--spec", "'cypress/integration/features/parameters.feature'"]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should run tests including steps that use custom parameter types without error", async function(){
            const expected = {
                passed: 1,                 failed: 0,
                missing: 0,                skipped: 0 // should be 1 (feature file has 2 tests)
            };
            await runCytorus(
                ["--tags", "'@params and @custom'",
                 "--spec", "'cypress/integration/features/parameters.feature'"]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
    });
});


