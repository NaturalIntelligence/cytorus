/// <reference types="cypress" />

import Converter from "../services/Converter";
import path from "path"


Given("the following query params", function (obj) {
    SC.converter = new Converter(obj);
    this.SC2 = "this is in mocha context"; //mocha context will not work with arrow function
});

And("post body", function (payload){
    SC.response = SC.converter.convert(payload);
    expect(this.SC2).to.be.equal("this is in mocha context");
});


Then(/converter service responds with ([0-9]+)(?: and)?/, (status, response) => {
    expect(status).to.equal(""+SC.response);
    if(response){
        expect(response.distance.from).to.be.string;
    }
});

step(/post body from "(.*)"/, (fileName) => {

    //const payload = fs.readFile("../files/"+fileName); //is not accessible in browser. Hence, not allowed
    cy.readFile( path.join( "cypress/integration/files", fileName) ).then( payload => {
        SC.response = SC.converter.convert(payload);
    });
    
});