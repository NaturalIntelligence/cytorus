const { Color } = require("../support/types");

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

step('I have {color} ball(s)', (color) => {
    expect(color).to.be.an.instanceof(Color);
    expect(color).to.have.property('name').that.is.a('string');
})

step('I use custom paramters to select values', () => {
    // do nothing
})

step('I can use the selected data later', () => {
    // do nothing
})
