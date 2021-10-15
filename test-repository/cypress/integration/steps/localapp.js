
step("I can access the application", ()=> {
    cy.request('http://localhost:3332').its('body').should('include', "I'm fine")
    //cy.request('http://127.0.0.1:3332').its('body').should('include', "I'm fine")
})