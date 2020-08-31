//TODO: support custom parameters. Ref: https://cucumber.io/docs/cucumber/cucumber-expressions/
//TODO: Externalize it

const regexMatch = [
    { key : /(?<!\\){int}/g, val: "-?[0-9]+"} ,
    { key : /(?<!\\){float}/g, val: "-?[0-9]+\\.[0-9]+"} ,
    { key : /(?<!\\){word}/g, val: "[^\\s]"} ,
    { key : /(?<!\\){string}/g, val: "['\"].*['\"]"} ,
    { key : /(?<!\\){}/g, val: ".*"} ,
]

const optionalText = [ /[^\\]\((.*?)\)/,  "\\((.*?)\\)" ];


/**
 * 
 * @param {string} exp 
 * @returns {string}
 */
function resolveExp(exp){

    //replace parameters
    for(let i=0; i < 5; i++){
        exp = exp.replace(regexMatch[i].key, regexMatch[i].val);
    }
    //resolve alternate text
    exp = exp.replace(/\((.*)\)\/\((.*)\)/g, "(?:(?:$1)?|(?:$2)?)");

    //replace optionalText
    exp = exp.replace(/[^\\]\(((?:(?<!\?\:).)*?)\)/g, "(?:$1)?");
    exp = exp.replace(/^(\(((?:(?<!\?\:).)*?)\))/, "(?:$1)?");
    
    //resolve alternate text
    exp = exp.replace(/([^\s\(\)]+)\/([^\s\(\)]+)/g, "(?:$1|$2)");
    return exp;
}

//TODO
/**
 * custom parameter
 * 
 * Example:
 * 
 * addParameter("color", "(#[a-zA-Z0-9]{6})", (val) => new Color(val) );
 * 
 * @param {string} param 
 * @param {string} regx 
 * @param {function} handler returns the object that should be passed to step definition method
 */
function addParameter(param, regx, handler){

}

module.exports = {
    resolveCucumberExp:resolveExp,
    addParameter:addParameter
}