Feature: to test performance for different implementation

Scenario: cucumber static and dynamic expressions
    #/^static string$/
    Given static string
    #/^("([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)') here$/
    When "anything" here
    #And fixed and dynamic
    And fixed and "dynamic"
    And fixed "dynamic" end


Scenario: caching of same steps
    Given a step for caching
    When a step for caching
    """
    has doc string
    """

@skip
Scenario: dynamic steps can't be cached
    Given dynamic step for caching
    When another step for caching

@skip
Scenario: steps starting or ending with fixed string
    Given fixed in starting, here dynamic
    When dynamic but fixed in end
    When fixed in start but dynamic in between
    When fixed in start, dynamic here, fixed in end