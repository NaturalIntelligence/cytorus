const fs = require("fs");
const filter = require("../src/ScenarioFilter");

describe("Scenario Filter", () => {
    //this.timeout(15000);

    let feature;
    let featureWithOnly;
    before( () => {
        feature = require("./assets/ScenarioFilterData.json");
        featureWithOnly = require("./assets/ScenarioFilterDataWithOnly.json");
    });

    it("---: should not throw error when config is not passed", () => {
        filter(feature);
    });

    it("should filter based on the tags ", () => {
        filter(feature, { tags: "@other"});
        console.log(JSON.stringify(feature,null, 4));
        //expect(output).toEqual(expected);
    });
    it.only("should filter based on the include ", () => {
        filter(feature, { include: "1.1,2"});
        //expect(output).toEqual(expected);
    });
    it("should filter based on the exclude ", () => {
        //expect(output).toEqual(expected);
    });
    it("should skip scenarios marked as @skip", () => {
        //expect(output).toEqual(expected);
    });
    it("should skip rest scenarios than marked as @only", () => {
        //expect(output).toEqual(expected);
    });
});
