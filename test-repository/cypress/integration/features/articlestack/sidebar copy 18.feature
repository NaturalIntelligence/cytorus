@done
Feature: sidebar

Background: open the site
    Given I open home page


Scenario: Recently Added
    Given "Recently Added" widget
    Then it has 5 links
    Then first link in the widget should points to the first post

Scenario: Tags cloud
    Given "Tags cloud" widget
    Then it has many links


Scenario: Poll widget
    Given "Poll" widget
    And I save previous result
    Then I vote for "Yes" option
    #This step fails when you cast vote from the same machine again
    #And the result for "Yes" option should be increased

Scenario: Archives widget
    Given "Archives" widget
    Then last entry is "October 2010"
    And first entry is same to the date of first post
    