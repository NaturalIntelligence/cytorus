Feature: check aruguments

Scenario: step with dynamic parameters for dynamic step
    Given I have following colors for wall
    #> []
    | red | blue | green |
    Then I can color with: red,blue,green
    When I have following colors for paper
    #> []
    | red | green | yellow |
    Then I can color with: red,green,yellow

Scenario: step with dynamic parameters for static step
    Given I have following colors
    #> []
    | red | blue | green |
    Then I can color with: red,blue,green
    When I have following colors
    #> []
    | red | green | yellow |
    Then I can color with: red,green,yellow