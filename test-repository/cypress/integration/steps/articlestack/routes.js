const basePage = "https://articlestack.wordpress.com";

step("category", category => {
    if(!category){
        category = "Other";
    }
    cy.visit(basePage + `/category/${category}`);
})

step("search", searchString => {
    cy.visit(basePage + `?s=${searchString}`);
})

step("tag", tag => {
    cy.visit(basePage + `/tag/${tag.toLowerCase()}`);
})

step("post", refUrl => {
    cy.visit(basePage + `/${refUrl}`);
})