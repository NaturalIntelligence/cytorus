const events = require('./Events');

function integrate(config){
  for (let i = 0; i < config.reports.length; i++) {
      const report = config.reports[i];
      for (let r_i = 0; r_i < report.hooks.length; r_i++) {
        const hook = report.hooks[r_i];
        events[hook.when](hook.for, hook.handler, hook.ref);
      }
  }
}

module.exports = integrate;