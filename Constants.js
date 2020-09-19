const fs = require("fs");
const path = require("path");
global.__projRootDir = process.cwd();
//Absolute paths are required to load a module from project root in plugin for processing

const PATHS = {};
PATHS.WD = ".cucumon/";
PATHS.MINIMAL_RESULT_PATH = PATHS.WD + "result/minimal/";
PATHS.DETAIL_RESULT_PATH = PATHS.WD + "result/detail/";
PATHS.CLI_ARG_PATH = PATHS.WD + "cli.json";
PATHS.CLI_ARG_ABS_PATH = path.join(__projRootDir, PATHS.WD, "cli.json"); //Used in Transformer
PATHS.SERIALIZED_FEATURE_PATH = PATHS.WD + "featureObj.json";
PATHS.FEATURES_CACHE = "cypress/integration/cucumon-cache/";
PATHS.FEATURES_PATH = "cypress/integration/features/";
PATHS.PROJ_CONFIG_FILENAME = "cucumon.r.js";
//PATHS.PROJ_CONFIG_ABS_PATH = path.join(__projRootDir, PATHS.PROJ_CONFIG_FILENAME);

const VALs = {};
VALs.DEBUG_COLOR = "\x1b[38;5;129;1m";
VALs.DEBUG_TASK = "cucumon_runner_debug";

const FNs = {};
FNs.CACHED_JSON_FILE = i => PATHS.FEATURES_CACHE + "group"+i+".json";
FNs.CACHED_FEATURE_FILE = i => PATHS.FEATURES_CACHE + "group"+i+".cucumon";
FNs.ABS = p => path.join(__projRootDir, p);
FNs.readIfExist = (m,otherwise) => fs.existsSync(m) ? require(m) : otherwise;
FNs.debug = msg => {
    if(process.env["DEBUG"] === "cucumon") console.log(VALs.DEBUG_COLOR, "DEBUG::" , msg,"\x1b[0m");
}
FNs.debug_cy = msg => {
    if(typeof cy !== "undefined") cy.task(VALs.DEBUG_TASK, msg);
}
module.exports = {
    PATHS: PATHS,
    FNs: FNs
}