Feature: Failing scenarios

Scenario: Step not found
    Given I start here
    And I dont find implementation of this step
    Then the above step should fail and all the steps from here should be skipped
    And this one too

Scenario: exist
    Given I start here
    Then this scenario should work fine
    
Scenario: implementation issue
    Given I start here
    Then I leave some error

Scenario: implementation issue
    Given I start here
    Then I throw some error
    



