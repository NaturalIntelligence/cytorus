Feature: Data Conversion service can convert as per the query


Scenario Outline: return status 200 when correct data is given otherwise 400

We test
* data tabe with auto conversion to object using instructor
* docString with no Examples header/token replacement
* docString with auto conversion to object using instructor
* Examples
* Scenario context

    Given the following query params
        #> {}
        | from | <h_from>  |
        | to   | <h_to> |
    And post body
    """
        <distance>
            <from>Delhi</from>
            <to>Mumbai</to>
            <km>1415.3</km>
        </distance>
    """
    Then converter service responds with <response code> and
    #> json
    ```
        {
            "distance": {
                "from": "Delhi",
                "to": "Mumbai",
                "km" : 1415.3
            }
        }
    ```

    Examples:
    | h_from  | h_to   | response code |
    | xml   | json | 200           |
    | json  | xml  | 400           |


Scenario Outline: return status 200 when converts from xml to [xml, nimn]

We test
* data tabe with auto conversion to object using instructor
* docString with no Examples header/token replacement
* Multiple Examples
* tag with Examples
* Scenario context

    Given the following query params
        #> {}
        | from | <h_from>  |
        | to   | <h_to> |
    And post body
        """
            <distance>
                <from>Delhi</from>
                <to>Mumbai</to>
                <km>1415.3</km>
            </distance>
        """
    Then converter service responds with <response code>

    Examples:
    | h_from  | h_to   | response code |
    | xml   | json | 200           |

    @wip
    Examples:
    | h_from  | h_to   | response code |
    | xml   | nimn | 200           |

@skip
Scenario: This scenario is not expected to be skipped with or without tag expression

We test
* @skip framework inbuilt tag

    Given the following query params
        #> {}
        | from | xml  |
        | to   | json |
    And post body
        """
            <distance>
                <from>Delhi</from>
                <to>Mumbai</to>
                <km>1415.3</km>
            </distance>
        """
    Then converter service responds with 200


Scenario: I should be able to load data from a file

""" Description
We test
* data tabe with auto conversion to object using instructor
* file import in step definitions
* Scenario context
"""

    Given the following query params
        #> {}
        | from | xml  |
        | to   | json |
    And post body from "sample.xml"
    Then converter service responds with 200