@tag2
Feature: Search on Google page 2
  
  Scenario: simple 2
    Given I open https://www.google.com/
    Then I type list of products  
    And Search
    