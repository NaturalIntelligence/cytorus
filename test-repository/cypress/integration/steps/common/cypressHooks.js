const {cliLog} = require("cytorus/Tasks");
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    cliLog(err.message);
    cy.log(err);
    return false
  })