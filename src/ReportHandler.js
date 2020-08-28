const handlers = [];

function register(handler){
    handlers.push(handler);
}

function report(featureObj){
    for (let i = 0; i < handlers.length; i++) {
        const handler = array[i];
        handler(featureObj);
    }
}

module.exports = {
    register: register,
    handlers: handlers,
    report: report
}