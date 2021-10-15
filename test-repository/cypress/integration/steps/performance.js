step("static string", (arg) => { ///^static string$/
    console.log(arg);
})
step("{string} here", (arg) => { ///^("([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)') here$/
    console.log(arg);
})
step("fixed and {string}", (arg) => {
    console.log(arg);
})
step("fixed {string} end", (arg) => {
    console.log(arg);
})
step("a step for caching", (arg) => {
    console.log(arg);
})
