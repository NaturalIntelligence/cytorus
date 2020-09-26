step('I buy {int} ball(s) in ₹{int}', () => {
    //do nothing
});

step("I didn't mean to select the data for processing", () => {
    //do nothing
});

step("I can use cucumber expressions in step definition/implementation", () => {
    //do nothing
});

And(/I select "(.*)" color/, (color) => {
    console.log("COLOR", color)
});

And(/^I select "(.*)"/,(anything)=>{
    console.log("Anything", anything)
    
})