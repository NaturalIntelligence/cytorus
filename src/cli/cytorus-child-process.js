const cypress = require('cypress');
const { debug } = require('../../Tasks');

let startTime = Date.now();

process.on('message', function(message) {
  //console.log('[child] received message from server:', message);
  const cmd = message.cmd;
  cypress[cmd](message.cypressConfig)
  .then((results) => {
    //console.log("completed")
    debug("Time taken by this set of specs: " + (Date.now() - startTime) );
    process.send({
      child   : process.pid,
      //result  : message + 1
    });
    process.disconnect();
  })
  .catch((err) => {
    console.log("Error")
    console.error(err)
    process.disconnect();
  })
});