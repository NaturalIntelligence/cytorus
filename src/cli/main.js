
/**
 * 1. Read CLI arguments
 * 2. Select & Parse feature files as per CLI arguments [To handle performance issue of loading ]
 * 3. Save file parsed object to filesystem
 * 4. Update Cytorus to pick input file from this location
 * 5. Invoke cypress to run tests
 * 6. Check against the defined strategy if the test result should be marked passed or failed
 * 7. Show summary report in the CLI
 * 8. Generate cucumber report once the tests are completed
 */

const url = require('url');
const fs = require('fs');
const fs_util = require('./../fs_util');
const path = require('path');
const paths = require('../../paths');
const fromCli = require('./ArgsReader');
const readAndParseFeatureFiles = require('./SpecsReader');
const balanceTestsInTestFiles = require('./ParallelProcessAnalyzer');
const {debug} = require('./../../Tasks');
const runTests = require("./ParallelProcessRunner");
const climsg = require('./climsg');
const evalTestResult = require("./TestResultEvaluator");
const buildMissingConfig = require("./projectConfigBuilder");
const filter = require('./../ScenarioFilter');
const filterByStory = require('./../filters/StoryFilter');
const filterByPosition = require('./../filters/PositionFilter');
const filterByRoute = require('./../filters/RouteFilter');
const filterByTagExpression = require('./../filters/TagExpressionFilter');
const createDirecPointers = require("./InstructionsIndexer");
const {durationToRedableFormat} = require("./../util");

let startTime;
let projConfig;
async function main(){
    
    //TODO: move it to cli.js
    if(process.argv[2] === 'open'){
        const cypress = require('cypress');
        cypress["open"](fromCli.cypressConfig);
        return;
    }
    startTime = Date.now();

    
    projConfig = buildMissingConfig(await importProjConfig() || {});

    //TODO: should be passed as method parameter
    // So that CLI or server or something else can take the responsibility to get tests
    let features = []; 
    
    //TODO: rename runConfig to filter
    features = readAndParseFeatureFiles(fromCli.runConfig); //filtered by file path expression
    debug("Filtered based on file expression");
    debug("Features to test:" + features.length);
    //if story or route filter is used, create indexes to cimplify filter process
    const pointers = createDirecPointers(features);

    //filter by story
    if(fromCli.story){
        features = filterByStory(features, pointers.story[fromCli.story]);
        debug("Filtered based on --story");
        debug("Features to test:" + features.length);
    }
    //filter by route
    const route = fromCli.viaRoute || fromCli.fromRoute || fromCli.onRoute;
    if(route){
        features = filterByRoute(features
            , route
            , pointers.route[route]
            , true
            , fromCli.fromRoute || fromCli.onRoute);
            debug("Filtered based on route");
            debug("Features to test:" + features.length);
    }else if(fromCli.notViaRoute){
        features = filterByRoute(features
            , fromCli.notViaRoute
            , pointers.route[fromCli.notViaRoute]);
            debug("Filtered based on --not-via");
            debug("Features to test:" + features.length);
    }
    //filter by tagExpression
    //filter by only
    //filter by skip
    
    if(fromCli.runConfig.tags){
        filterByTagExpression(features, fromCli.runConfig.tags);
        debug("Filtered based on tag expression");
        debug("Features to test:" + features.length);
    }else if(fromCli.runConfig.include){
        filterByPosition(features, fromCli.runConfig.include, true);
        debug("Filtered based on --only");
        debug("Features to test:" + features.length);
    }else if(fromCli.runConfig.exclude){
        filterByPosition(features, fromCli.runConfig.exclude, false);
        debug("Filtered based on --skip");
        debug("Features to test:" + features.length);
    }else{
        //Will be done at runtime
        //filterForPriorityTags(features); 
    }

    filter( features , fromCli.runConfig); //keep only the selected tests
    debug("Marking priority tags");
    //save the filtered features in cache folder so that cypress can pick them
    //Based on how many processes can run in parallel, we can create number of input test files

    let routeCount = 0;
    if(fromCli.onRoute ){
        routeCount = 1;
    }else if(fromCli.tillRoute ){
        routeCount = +fromCli.tillRoute;
    }
    saveCliOptions(routeCount);
    let cachedSpecs = balanceTestsInTestFiles(fromCli, features);
   


    debug("Processing init hook");
    await projConfig.init();
    runTests(cachedSpecs, fromCli, projConfig, postRun);

    
}

//Cypress start a new process to run the tests
//So to communicate with code, necessary options can be saved on the disk
function saveCliOptions(routeCount) {
    try {
        const cliObj = {
            isCyDashboard: process.argv[2] === 'open',
            cli: true,
            routeCount: routeCount
        };
        fs.writeFileSync(paths.cli, JSON.stringify(cliObj));
        debug("CLI options are saved to disk");
    } catch (err) {
        console.error("Error in creating", paths.cli);
        process.exitCode = 1;
    }
}

/**
 * Display decorated output once all the tests are completed
 * Remove cli option file
 * Run after tests hooks
 */
async function postRun(){
    //TODO: instead of reading all the result files in memory
    // getStats and checkthreshld for each file
    const jointReport = mergeResults(paths.report.minimal);

    debug("Removing cli.json");
    fs.unlinkSync( paths.cli );
    const stats = getStats(jointReport);

    debug("Save result stats to a file for further use");
    fs.writeFileSync(paths.stats, JSON.stringify(stats));

    if(fromCli.skipThreshold || !projConfig.threshold) projConfig.threshold = [];

    debug("Evaluate the build status");
    const result = evalTestResult(projConfig.threshold, jointReport);
    debug("build status is evaluated");
    const endTime = Date.now();
    const testDuration = durationToRedableFormat(endTime - startTime);
    
    debug("Processing end hook");
    await projConfig.end();

    console.log(climsg.separator());
    let exitCode = 0;
    if(result !== true){
        console.log( climsg.errMsg(result,stats,testDuration) );
        exitCode = 1;
    }else{
        console.log( climsg.successMsg(result,stats,testDuration) );
        exitCode = 0;
    }

    if(fromCli.tian)    {
        debug("Submmiting test result to Tian dashboard");
        await submitTestDataToTian(result === true ? "pass" : "fail", startTime, endTime);
    }
    process.exitCode = exitCode;
}

const axios = require('axios');
const { secureHeapUsed } = require('crypto');

/**
 * Merge detailed test results of each feature
 * Submit the test data to Tian dashboard
 */
async function submitTestDataToTian(runStatus, startTime, endTime){
    const build_id = fromCli.build || process.env["BUILD_ID"];
    if(build_id){
        let tianUrl = projConfig.runConfig.tian && projConfig.runConfig.tian.url;
        if(tianUrl){
            console.log("Submitting test data to ", tianUrl);
            const payload = {
                id: build_id,
                status: runStatus,
                startAt: startTime,
                endAt: endTime,
                data: mergeResults(paths.report.detailed)
            };
            await axios.post(tianUrl, payload )
            .then((res) => {
                if(res.status === 200){
                    console.log("Test data is submitted successfully to Tian");
                }else{
                    console.error(res.data);
                }
            }).catch((error) => {
                console.error("Test data submission failed");
                if(error.response){
                    console.error("Status code: ", error.response.status);
                    console.error("Error response: ",error.response.data);
                }else{
                    console.error(error.message);
                }
            });
        }
    }else{
        debug("Build is not found to submit test data to Tian");
    }
}

function mergeResults(resultPath){
    debug(`Reading results files from ${resultPath}`);
    const results = fs.readdirSync(resultPath);
    const mergedResults = [];
    for (const file of results) {
        //TODO: make it async
        const filePath = path.join(resultPath, file);
        debug(`${filePath}: ${fs_util.size(filePath)}`);
        mergedResults.push(
            require(fs_util.absolute(filePath))
        );
    }
    debug(`Read ${mergedResults.length} files`);
    return mergedResults;
}

function getStats(minimalReport){
    debug("Calculating result stats");
    const count = {
    passed: 0,
    failed: 0,
    missing: 0,
    skipped: 0,
    }
    for (let f_i = 0; f_i < minimalReport.length; f_i++) {
        const feature = minimalReport[f_i];
        for (let s_i = 0; s_i < feature.scenarios.length; s_i++) {
        const scenario = feature.scenarios[s_i];
        if(scenario.status === "passed"){
            count.passed++;
        }else if(scenario.status === "failed"){
            count.failed++;
        }else if(scenario.status === "undefined"){
            count.missing++;
        }else if(scenario.status === "skipped"){
            count.skipped++;
        }
        }
    }
    
    return count
}

/**
 * Import project configuration file from user's workspace
 * @returns 
 */
async function importProjConfig(){
    try{
        const fullPath = fs_util.absolute( paths.projConfigFileName );
        return await requireOrImport( fullPath );
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

const requireOrImport = async file => {
    let fileName = "";
    if(fs.existsSync(file + ".js")) fileName = file + ".js";
    else if(fs.existsSync(file + ".mjs")) fileName = file + ".mjs";
    //To support .ts extension add TS compiler to the project
    //else if(fs.existsSync(file + ".ts")) fileName = file + ".ts";
    else return {};
    console.debug("Loading project configuration file from", fileName);
    
    fileName = path.resolve(fileName);

    if (path.extname(fileName) === '.mjs') {
        return import(url.pathToFileURL(fileName));
    }
    // This is currently the only known way of figuring out whether a file is CJS or ESM.
    // If Node.js or the community establish a better procedure for that, we can fix this code.
    // Another option here would be to always use `import()`, as this also supports CJS, but I would be
    // wary of using it for _all_ existing test files, till ESM is fully stable.
    try {
        return require(fileName);
    } catch (err) {
        console.log(err.code);
        //return import(url.pathToFileURL(file));
        if (err.code === 'ERR_REQUIRE_ESM') {
            return import(url.pathToFileURL(fileName));
        } else {
            throw err;
        }
    }
};

module.exports = main;

