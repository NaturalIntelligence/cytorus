#!

# @skip doesn't skip a test from parsing
@skip
Feature: No place for mistakes

This test will fail at the time of setup.
It must not impact other feature files. But no test from this file will run
Since it'll fail at the time of setup it'll not even check if any step is defined or not

#Error: Unexpeted line at line number 12 

Scenario: Error
    Given I start here
    And I leave syntax error
    ""
    I'm wrong
    ""
    Then no Scenario should be executed from this file