step("I can see {int} post(s) on the page", count => {
    cy.get(".post").should('have.length', count);
})
step("I see no post in search result", () => {
    cy.get(".post").should('have.length', 0);
})

step("all the posts are expanded", () => {
    cy.get(".post").each( post => {
        cy.wrap(post).find(".content").should("be.visible");
    })
});

step("I check the structure of first post", () => {
    cy.get(".post").eq(1).as("post");
})

step("I access first post", () => {
    cy.get(".post").eq(1).find("h2 .title").click();
})
step("I read the post", () => {
    //do nothing
})

step("it has following sections in info section", (sections) => {
    cy.get("@post").find(".info span").each( (span,i) => {
        cy.wrap(span).should("have.class", sections[i]);
    });
});

step("post has {string} section", (section) => {
    cy.get("@post").find(`.${section}`).should("be.visible");
});

