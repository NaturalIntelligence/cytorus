global.__projRootDir = process.cwd();
//Absolute paths are required to load a module from project root in plugin for processing

const WD = ".cytorus/";
const paths = {
    WS : process.cwd(), //Project root; User's workspace
    WD : WD, //Cytorus workspace in user's workspace
    cli : WD + "cli.json",
    report : {
        minimal : WD + "result/minimal/",
        detailed : WD + "result/detail/"
    },

    serialized_feature : WD + "featureObj.json",

    //Cypress can read input test file from "cypress/integration" only. And the folder should not be hidden like ".cytorus"
    cache : "cypress/integration/cytorus-cache/",
    features : "cypress/integration/features/",

    projConfigFileName: "cytorus.config",
    stats: WD + "result/stats.json",
};

module.exports = paths;