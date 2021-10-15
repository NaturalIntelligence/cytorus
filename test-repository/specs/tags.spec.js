const runCytorus = require("./runCytorus");
const assert = require('chai').assert;
const datahelper = require('./datahelper');


describe("cytorus", () => {
    describe("--tags", function() {
        this.timeout(15000);

        it("should run tests as per the tag expression including feature files in nested folder", async function(){
            const expected = {
                passed: 2,                 failed: 0,
                missing: 0,                skipped: datahelper.tests.total - 2
            };
            await runCytorus(
                ["--tags", "'@first'"]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should run tests as per the tag expression in selected feature files only", async function(){
            const expected = {
                passed: 1,                 failed: 0,
                missing: 0,                skipped: 3
            };
            await runCytorus(
                ["--tags", "'@first'"
                , "--spec", "'cypress/integration/features/tags.feature'" ]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should run tests as per the tag expression in selected feature files only 2", async function(){
            //@first tag is present in tags.feature which is in `features` folder and a nested folder
            //In this test we're not selecting feature files from nested folder
            //So only 1 test should run and pass
            const expected = {
                passed: 1,                 failed: 0,
                missing: 0,                skipped: 29
            };

            await runCytorus(
                ["--tags", "'@first'"
                , "--spec", "'cypress/integration/features/*.feature'" ]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should not run tests if tag expression doesn't resolve any test", async function(){
            const expected = {
                passed: 0,                 failed: 0,
                missing: 0,                skipped: 3
            };
            await runCytorus(
                ["--tags", "'@first'"
                , "--spec", "'cypress/integration/features/google*.feature'" ]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should not run tests if tag expression doesn't resolve any test 2", async function(){
            const expected = {
                passed: 0,                 failed: 0,
                missing: 0,                skipped: datahelper.tests.total 
            };
            await runCytorus(
                ["--tags", "'@unknown'"]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should run tests as per the tag expression and ignore other filtering options", async function(){
            const expected = {
                passed: 0,                 failed: 0,
                missing: 0,                skipped: 3
            };
            await runCytorus(
                ["--tags",          "'@unknown'"
                ,"--only",    "[1]" 
                , "--spec",         "'cypress/integration/features/google*.feature'" ]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
        it("should not run tests if tag exp is @skip", async function(){
            const expected = {
                passed: 0,                 failed: 0,
                missing: 0,                skipped: 6
            };
            await runCytorus(
                ["--tags",          "'@skip'"
                , "--spec",         "'cypress/integration/features/dataConverter.feature'" ]
                ,result => { assert.deepEqual(result, expected); }
            );
        });
    });
});


