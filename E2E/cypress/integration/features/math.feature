@skip
Feature: Test various features of cypress cucumon runner framework using math expressions

Scenario Outline: return status 200 when correct data is given otherwise 400

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

