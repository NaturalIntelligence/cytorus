const logger = require("../logger");
import {print} from "../../util";

let count = 0;

When(/I type (.*)/, (url) => {
    count++;
    cy.get("input[type='text']").type("amit");
    logger.info("Search completed");
    if(count%2 === 1)    {
        assert.fail();
    }
    print("Search completed");
    
});

When(/^Search/, (url) => {
    cy.get("input[type='submit']")  

    
});
  