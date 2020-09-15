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

function registerBeforeEvent( eventName, fn, instanceRef){
    if(beforeEvents[eventName]){
        beforeEvents[eventName].push({
            fn: fn,
            ref: instanceRef
        });
    }
}
function registerAfterEvent( eventName, fn, instanceRef){
    if(afterEvents[eventName]){
        afterEvents[eventName].push({
            fn: fn,
            ref: instanceRef
        });
    }
}

function trigger(ba, eventName, arg){
    let registry = beforeEvents;
    if(ba === "A"){
        registry = afterEvents;
    }
    //TODO: test that fn should run in it's own context
    window.Cypress.Promise.each( registry[eventName] , item => {
        if(item.ref){
            cy.task("clilog", "Has reference");
            item.fn.apply(item.ref, [arg]);
        }else{
            cy.task("clilog", "On cypress reference");
            item.fn.apply(this, [arg]);
        }
    });
}

window.Before = registerBeforeEvent;
window.After = registerAfterEvent;
//window._c_trigger = trigger;

module.exports = {
    before: registerBeforeEvent,
    after: registerAfterEvent,
    trigger : trigger
}