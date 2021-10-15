const expect =  require("chai").expect;

step("there is a navigation menu to show {int} categories", count => {
    cy.get("#menus > .cat-item").should('have.length', count);
})

step("there is a donate button", () => {
    cy.get("#header")
        .find(".banner a")
        .invoke('attr', 'href')
        .should("include", "https://www.paypal.com/");
})

step("there is a search box", () => {
    cy.get("#searchbox").should("be.visible")
});


