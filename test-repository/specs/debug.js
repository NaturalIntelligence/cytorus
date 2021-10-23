const runCytorus = require("./runCytorus");

await runCytorus(
    [
        "--story", "US004",
        , "--spec",         "'cypress/integration/features/pizza.feature'"
    ]
    ,result => { 
        console.log(result);
    }
);