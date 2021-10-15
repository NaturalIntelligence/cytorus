const {timeToRedableFormat} = require("./src/util");
let DEBUG_COLOR = "\x1b[38;5;129;1m";
if(process.env["NO_COLOR"] === 1){
    DEBUG_COLOR = ""
}

const tasks = {}

/**
 * Suitable to display debug logs from Cytorus code which runs outside the browser
 * @param {string} msg 
 */
tasks.debug = msg => {
    if(process.env["DEBUG"] === "cytorus") console.log( timeToRedableFormat(Date.now()), DEBUG_COLOR, "DEBUG::" , msg,"\x1b[0m");
}

/**
 * Cuitable to display debug logs from code running in browser. Like user's workspace
 * @param {string} msg 
 */
tasks.cliLog = msg => {
    if(typeof cy !== "undefined") cy.task( "cytorus_debug" , msg);
}

module.exports = tasks