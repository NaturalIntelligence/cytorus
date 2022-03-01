@params
Feature: Support cucumber expression

@builtin
Scenario: default paramters
    # I buy {int} {string}(s) in ₹{float}
    Given I buy 4 balls in ₹300
    And I didn't mean to select the data for processing
    # I can use cucumber expressions in step definition/implementation
    Then I can use cucumber expressions in step definition
    Then I can use cucumber expressions in step implementation
    And I select "red" color
    And I select "red color"

@custom
Scenario: custom paramters
    # I have {color} {string}(s)
    Given I have red balls
    And I use custom paramters to select values
    Then I can use the selected data later