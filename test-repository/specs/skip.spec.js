const runCytorus = require("./runCytorus");
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const {forEachScenario } = require("cytorus/src/Iterators");
const { shouldBeSkipped, shouldNotBeSkipped } = require("./assertionHelper");

describe("cytorus", () => {
    describe("--skip", function() {
        this.timeout(15000);

        it("should skip tests of given position with examples positions in given test file but not skip other tests marked by @skip", async function(){
            const expected = {
                passed: 3,                 failed: 0,
                missing: 0,                skipped: 3
            };
            // scenario 1 has 2 examples
            // scenario 2 has 2 examples
            // scenario 3 is @skip
            await runCytorus(
                [
                    "--skip", "1.1,2",
                    , "--spec",         "'cypress/integration/features/dataConverter.feature'"
                ]
                ,result => { 
                    assert.deepEqual(result, expected);//check count wise
                    shouldBeSkipped([1,3,4]); //check position wise
                    shouldNotBeSkipped([2,5,6]); //check position wise
                 }
            );
        });
        it("should ignore fraction number when for non-scenario outline", async function(){
            const expected = {
                passed: 2,                 failed: 0,
                missing: 0,                skipped: 0
            };
            // scenario 1 is not scenario outline
            await runCytorus(
                [
                    "--skip", "1.1",
                    , "--spec",    "'cypress/integration/features/google.feature'"
                ]
                ,result => { 
                    assert.deepEqual(result, expected);//check count wise
                    shouldNotBeSkipped([1,2]); //check position wise
                 }
            );
        });
        it("should run all tests when given scenario position doesn't exist", async function(){
            const expected = {
                passed: 2,                 failed: 0,
                missing: 0,                skipped: 0
            };
            // scenario 1 is not scenario outline
            await runCytorus(
                [
                    "--skip", "3",
                    , "--spec",    "'cypress/integration/features/google.feature'"
                ]
                ,result => { 
                    assert.deepEqual(result, expected);//check count wise
                    shouldNotBeSkipped([1,2]); //check position wise
                 }
            );
        });
        it("should run all tests when given example position doesn't exist", async function(){
            const expected = {
                passed: 0,                 failed: 0,
                missing: 0,                skipped: 6
            };
            // scenario 1 has 2 examples only
            await runCytorus(
                [
                    "--skip", "1.3",
                    , "--spec",    "'cypress/integration/features/dataConverter.feature'"
                ]
                ,result => { 
                    assert.deepEqual(result, expected);//check count wise
                    shouldNotBeSkipped([1,2,3,4,5,6]); //check position wise
                 }
            );
        });

    });
});