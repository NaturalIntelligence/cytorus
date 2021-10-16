const { Given, When, Then, And, But, step} = require("cytorus/src/Globals");

Given("I'm on home page", () => {})
Given("I'm on any page", () => {})

Then("I should see the top selling pizzas", ()=>{})
Then("I should see the list of side dishes", ()=>{})

When("I search pizza by {string}", (searchTerm)=>{})
Then("it should result all pizzas", ()=>{})
Then("it should result following pizzas", (pizzasList)=>{})

When("I add a pizza in the cart", (order)=>{})
step("I can see the cart with selected items", ()=>{})
