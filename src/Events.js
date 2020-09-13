//In browser

const beforeEvents = {
    suit: [],
    feature: [],  //Before each feature; args: featureObject
    rule: [],     //Before each rule
    scenario: [], //Before each scenario
    step: [],     //Before each step
}

const afterEvents = {
    suit: [],
    feature: [],     //Before each 
    rule: [],
    scenario: [], //Before each scenario
    step: [], //After each scenario
    //error: [] //When a step fails
}

function before( eventName, fn){
    if(beforeEvents[eventName]){
        beforeEvents[eventName].push(fn);
    }
}
function after( eventName, fn){
    if(afterEvents[eventName]){
        afterEvents[eventName].push(fn);
    }
}

function trigger(ba, eventName, arg){
    let registry = beforeEvents;
    if(ba === "A"){
        registry = afterEvents;
    }
    //TODO: test that fn should run in it's own context
    window.Cypress.Promise.each( registry[eventName] , fn => fn.apply(this, [arg]) );
}

window.Before = before;
window.After = after;
window._c_trigger = trigger;