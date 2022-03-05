//This code will run in browser
//window.Repository object should be available when globals are loaded

//These functions are expected to be called from browser
const Registry = require("./Registry");
//const events = require("./Events");

function registerStepDef(step_exp, fn){
    Registry.register(step_exp, fn);
};

if(window){
    window.But 
    = window.And 
    = window.Then 
    = window.When 
    = window.Given 
    = window.step 
    = window.given
    = window.when 
    = window.then 
    = window.but 
    = window.and 
    = registerStepDef
}
// if(window){
//     window.beforeEachScenario = (fn) => {
//             events.register( "scenario", "before", fn);
//     }
//     window.beforeEachFeature = (fn) => {
//             events.register("feature", "before", fn);
//     }
// }

module.exports = {
    But : registerStepDef, 
    And : registerStepDef, 
    Then : registerStepDef, 
    When : registerStepDef, 
    Given : registerStepDef, 
    but : registerStepDef, 
    and : registerStepDef, 
    then : registerStepDef, 
    when : registerStepDef, 
    given : registerStepDef, 
    step : registerStepDef,
    defineParameterType: Registry.defineParameterType
}