@tag
Feature: Search on Google page
  
  #>retries:2
  Scenario: simple
    Given I open https://www.google.com/
    Then I type list of products  
    And Search
  
  @skip
  Scenario: simple 3
    Given I start here
    Then I open https://www.google.com/
    Then I type list of products  
    And Search
    