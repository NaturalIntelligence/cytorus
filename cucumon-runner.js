#!/usr/bin/env node
const cypress = require('cypress')
let startTime = Date.now();

cypress.run({
  //spec: './cypress/integration/features/failing.feature',
  //port: 8999
})
.then((results) => {
  console.log("completed")
  console.log(Date.now() - startTime);
})
.catch((err) => {
    console.log("error")
  console.error(err)
})