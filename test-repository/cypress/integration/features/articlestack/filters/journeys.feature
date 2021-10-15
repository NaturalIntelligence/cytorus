@journey
@done
Feature: Testing filters

Background: open the site
    Given I open home page

Scenario: journey to the category page
    Then I can see 11 posts on the page
    And there is a navigation menu to show 6 categories
    When I click on "Other" category
    #> story:1279; route: category(other)
    Then I can see 5 posts on the page
    When I access first post
    Then I read the post

Scenario: journey to the search result
    Then I can see 11 posts on the page
    When I search for "java"
    #> route: search(java)
    Then I can see 10 posts on the page
    When I search for "javascript"
    #> route: search(javascript)
    Then I see no post in search result

Scenario: journey via search page to category page
    Then I can see 11 posts on the page
    When I search for "java"
    #> route: search(java)
    Then I can see 10 posts on the page
    When I search for "javascript"
    #> route: search(javascript)
    Then I see no post in search result
    When I click on "reviews" category
    #> story:1279; route: category(reviews, useless)
    Then I can see 3 posts on the page
    When I access first post
    Then I read the post

Scenario: journey via search page, category page to tags page
    Then I can see 11 posts on the page
    When I search for "java"
    #> route: search(java)
    Then I can see 10 posts on the page
    When I search for "javascript"
    #> route: search(javascript)
    Then I see no post in search result
    When I click on "Other" category
    #> story:1279; route: category(other)
    Then I can see 5 posts on the page
    When I access first post
    #> route: post(2017/02/25/stubmatic-5-is-live-now/)
    Then I read the post
    When I access "Youtube" tag
    #> story:1224; route: tag(Youtube)
    Then I can see 1 post on the page

Scenario: route with no parameter
    Then I can see 11 posts on the page
    And there is a navigation menu to show 6 categories
    When I click on "Other" category
    #> story:1279; route: category
    Then I can see 5 posts on the page
    When I access first post
    Then I read the post