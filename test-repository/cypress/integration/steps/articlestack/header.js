step("there is a navigation menu to show {int} categories", count => {
    cy.get("#menus > .cat-item").should('have.length', count);
})

step("I click on {string} category", category => {
    if(!category){
        category = "Other"
    }
    cy.get(".cat-item a").contains(category).click();
})

step("I search for {string}", searchString => {
    cy.get("#searchbox").find("[type='text']").type(searchString);
    cy.get("#searchbox").find("[type='submit']").click();
})