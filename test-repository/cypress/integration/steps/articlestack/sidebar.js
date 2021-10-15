const assert = require("assert");
const { expect } = require("chai");

const widgetsClasses = {
    "feeds" : "widget_feeds",
    "Recently Added" : "widget_recent_entries",
    "Tags cloud" : "wp_widget_tag_cloud",
    "Poll" : "widget_text",
    "Archives" : "widget_archive",
}

step("there is a side bar with following widgets", (widgets) => {
    cy.get("#sidebar").find(".widget").each( (widget,i) => {
        cy.wrap(widget).should("have.class", widgetsClasses[widgets[i]] );
    })
});


step('{string} widget', ( widgetName) => {
    cy.get("#sidebar").find(`.${widgetsClasses[widgetName]}`).as("widget")
})

step("it has {int} links", count => {
    cy.get("@widget").find("a").should("have.length", count);
})
step("it has many links", count => {
    cy.get("@widget").find("a").should("not.have.length", 0);
})

step("it has {int} links", count => {
    cy.get("@widget").find("a").should("have.length", count);
})

const positionIndexMap = {
    "first": 0,
    "second": 1,
    "thrid": 2,
}

step('{word} link in the widget should points to the {word} post', (linkPosition, postPosition) => {
    cy.get("@widget").find("a")
        .eq(positionIndexMap[linkPosition])
        .invoke("attr", "href")
        .then( href => {
            cy.get(".type-post h2 a ").eq(positionIndexMap[postPosition]).should("have.attr", "href",  href);
    });
})

step('I save previous result', option => {
    SC.voteResult = {};
    cy.get("@widget").find(".pds-links .css-view-results").click()
    cy.wait(2000);
    cy.get("@widget")
        .find(".pds-answer")
        .find(".pds-feedback-group").each( group => {
            let ans = "";
            cy.wrap(group).find(".pds-answer-text").invoke("text" ).then( text => {
                ans = text.trim();
            });
            cy.wrap(group).find(".pds-feedback-votes").invoke("text" ).then( text => {
                SC.voteResult[ans] = +/[0-9]+/.exec(text)[0];
            });
        });
    cy.get(".pds-return-poll").click();
});

step('I vote for "{word}" option', option => {
    cy.get("@widget").find(".pds-answer .pds-answer-group")
        .contains(option).click();
    cy.get(".pds-vote").click();
    cy.wait(1000);
})

step('the result for "{word}" option should be increased', option => {
    const afterResult = {};
    cy.get("@widget")
        .find(".pds-answer")
        .find(".pds-feedback-group").each( group => {
            let ans = "";
            cy.wrap(group).find(".pds-answer-text").invoke("text" ).then( text => {
                ans = text.trim();
            });
            cy.wrap(group).find(".pds-feedback-votes").invoke("text" ).then( text => {
                afterResult[ans] = +/[0-9]+/.exec(text)[0];
            });
        });
        cy.then( () => {
            
            //assert.equal( SC.voteResult[option],  actualVoteResult[option] + 1);
            expect(afterResult[option] + 1).to.be.equal(SC.voteResult[option]);
        })
    
});

step('last entry is {string}', date => {
    cy.get("@widget")
        .find("li").last().invoke("text").then( dateStr => {
            expect(dateStr.trim()).to.be.equal(date);
        })
})

step('{word} entry is same to the date of {word} post', (archiveMonthPosition, postPosition) => {
    cy.get("@widget")
        .find("li").eq(positionIndexMap[archiveMonthPosition])
        .invoke("text").then( dateStr => {
            dateStr = new Date(dateStr.trim());
            cy.get(".type-post").eq(positionIndexMap[postPosition])
                .find(".date").invoke("text").then( postDateStr => {
                    postDateStr = new Date(postDateStr.trim());

                    expect(dateStr.getMonth()).to.be.equal(postDateStr.getMonth());
                    expect(dateStr.getFullYear()).to.be.equal(postDateStr.getFullYear());
                })
        })
})

step("I access {string} tag", tag => {
    cy.get("#sidebar")
        .find(`.${widgetsClasses["Tags cloud"]}`)
        .find(".tag-cloud-link")
        .contains(tag);
});