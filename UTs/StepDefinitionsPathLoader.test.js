const filesLoadingScriptGenerator = require("../src/StepDefinitionsPathLoader");
const chai = require("chai");
const {expect} = require("chai");
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe("Step Definitions Path Script Generator ", () => {
    it("should include js and ts files", () => {
        const script = filesLoadingScriptGenerator("./test-repository");
        expect(script.length).to.be.above(1);
        for (let index = 0; index < script.length; index++) {
            const loadingStr = script[index];
            expect(loadingStr.endsWith(".js');") || loadingStr.endsWith(".ts');")).to.be.true;
        }
    });
});