@done
Feature: home page

Background: open the site
    Given I open home page


Scenario: check page structure
    Then I can see 11 posts on the page
    And there is a navigation menu to show 6 categories
    And there is a donate button
    And there is a search box
    And there is a side bar with following widgets
    #>[]
    |feeds|
    |Recently Added|
    |Tags cloud|
    |Poll|
    |Archives|

Scenario: posts appearance
    Then I can see 11 posts on the page
    And all the posts are expanded
    Then I check the structure of first post
    And it has following sections in info section
    #>[]
    |date|
    |author|
    |comments|
    And post has "content" section
    And post has "categories" section
    #And post has "share this" section

Scenario: page loading
    Then I can see 11 posts on the page
    When I scroll till the end of the page
    Then I can see 21 posts on the page

