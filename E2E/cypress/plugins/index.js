// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const CucumonRunner = require('cypress-cucumon-runner');
module.exports = (on, config) => {
  const cucumonRunner = new CucumonRunner(config);
  
  //cucumonRunner.enableTasks(on);

  //cucumonRunner.reportTo(reportHandler);
  //cucumonRunner.reportTo(reportHandler2);
  // afterFeature(()=>{
  //   reportHandler.apply(this, arguments);
  //   reportHandler2.apply(this, arguments);
  // })

  on('task', {
    clilog (message) {
      console.log(message)
      return null
    }
  })
  on('file:preprocessor', cucumonRunner.filePreProcessor());
}

