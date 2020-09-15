const cypress = require('cypress')
let startTime = Date.now();


process.on('message', function(message) {
  //console.log('[child] received message from server:', message);
  const cmd = message.cmd;
  cypress[cmd](message.cypressConfig)
  .then((results) => {
    console.log("completed")
    console.log(Date.now() - startTime);
    process.send({
      child   : process.pid,
      result  : message + 1
    });
    process.disconnect();
  })
  .catch((err) => {
    console.log("Error")
    console.error(err)
    //process.exit(1);
    process.disconnect();
  })
});