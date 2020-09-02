const logger = require("./logger");
import {print} from "./util";

When(/I type (.*)/, (url) => {
    cy.get("input[type='text']").type("amit");
    logger.info("Search completed");
    print("Search completed");
});

When(/Search/, (url) => {
    cy.get("input[type='submit']")  

    
});
  