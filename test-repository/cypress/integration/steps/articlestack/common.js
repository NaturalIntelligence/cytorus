/// <reference types="cypress" />

const basePage = "https://articlestack.wordpress.com";
const pagenameMapping = {
    "home": "/"
}

step('I open {word} page', pageName => {
    cy.visit(basePage + pagenameMapping[pageName]);
})

step("I scroll till the end of the page", (section) => {
    cy.scrollTo("bottom");
});
