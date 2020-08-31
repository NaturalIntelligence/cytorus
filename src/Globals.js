//This code will run in browser
//window.Repository object should be available when globals are loaded

//These functions are expected to be called from browser
const Repository = require("./Repository");

if(window){
    window.But = window.And = window.Then 
        = window.When = window.Given = window.step = (step_exp, fn) => {
            Repository.register(step_exp, fn);
    }
}
