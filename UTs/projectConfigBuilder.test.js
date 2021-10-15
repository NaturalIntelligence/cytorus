const buildConfig = require("../src/cli/projectConfigBuilder");
const chai = require("chai");
const {expect} = require("chai");
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe("Project Config Builder", () => {
    it("should include all default properties ", () => {
        const projConfig = buildConfig({});
        //console.log(projConfig);
        expect(projConfig).to.containSubset({
            //"end": [Function],
            //"init": [Function],
            "runConfig": {
              "docker": {
                "cypress": "7.3.0",
                "env": [],
              }
            },
            // "setup": {
            //   "step_definitions": "steps",
            // },
            "threshold": []
        });

        expect(typeof projConfig.init).to.equal("function");
        expect(typeof projConfig.end).to.equal("function");
    });
    
    it("should include all nested default properties ", () => {
        const projConfig = buildConfig({runConfig: {}});
        expect(projConfig).to.containSubset({
            //"end": [Function],
            //"init": [Function],
            "runConfig": {
              "docker": {
                "cypress": "7.3.0",
                "env": [],
              }
            },
            // "setup": {
            //   "step_definitions": "steps",
            // },
            "threshold": []
        });

        expect(typeof projConfig.init).to.equal("function");
        expect(typeof projConfig.end).to.equal("function");
    });

    it("should throw error invalid data type for threshold", () => {
        try{
            buildConfig({
                runConfig: {
                    "env2" : ""
                },
                threshold: ""
            });
        }catch(err){
            expect(err.message).to.be.equal("Threshold must be defined as  an array of objects in project configuration");
        }
      
    });

    it("should not update property if exists", () => {
        const projConfig = buildConfig({
            "end": () => 30,
            "init": () => 35,
            "runConfig": {
                "docker": { 
                    "env": ["RANDOM"],
                }
            },
            // "setup": {
            //     "step_definitions": "other",
            //   },
              "threshold": [{
                  "some-property" : 34
              }]
        });
        expect(projConfig).to.containSubset({
            "runConfig": {
              "docker": {
                "cypress": "7.3.0",
                "env": [],
              }
            },
            // "setup": {
            //   "step_definitions": "other",
            // },
            "threshold": [{
                "some-property" : 34
            }]
        });
        expect(projConfig.runConfig.docker.env).to.deep.equal( ["RANDOM"] );
        expect(projConfig.init()).to.equal( 35);
        expect(projConfig.end()).to.equal( 30);
    });
});
