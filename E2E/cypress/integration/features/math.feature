@skip
Feature: Test various features of cypress cucumon runner framework using math expressions

Scenario Outline: math feature

We test
* custom examples matrix expander

    Given the math expression '<a> + <b>'
    Then I get the answer

    #> x
    Examples:
     | a |
    #----- 
     | 2 |
     | 3 |
    
    Examples:
     | b |
    #----- 
     | 4 |
     | 5 |

