
const events = {
    before: {
        "feature":[],
        "scenario":[]
    },
    after: {
        "feature":[],
        "scenario":[]
    }
}

function register(eventName, when, fn){
    if(events[when][eventName] != undefined){
        events[when][eventName].push(fn);
    }else{
        throw new Error( eventName + " event is not supported");
    }
}

function execute(eventName, when){
    const eventList = events[when][eventName];
    for (let i = 0; i < eventList.length; i++) {
        const fn = eventList[i];
        fn();
    }
}

module.exports.register = register;
module.exports.execute = execute;