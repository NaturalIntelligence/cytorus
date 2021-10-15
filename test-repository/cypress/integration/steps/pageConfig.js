
Given(/^I open ([^ ]*)$/, (url) => {
  console.log("visiting the page", url)
  cy.visit(url)
});

