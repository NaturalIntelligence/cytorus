step("I have following colors", colors => {
    SC.colors = colors;
})

step(/I have following colors for (.*)/, (surface, colors) => {
    console.log("Coloring on", surface);
    SC.colors = colors;
})

Then(/I can color with: (.*)/, colors => {
    expect(colors.split(",")).to.deep.equal(SC.colors);
})