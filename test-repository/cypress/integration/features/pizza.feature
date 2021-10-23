Feature: I can order a Pizza

Rule: Explore available products

Scenario: Display Trendy Pizzas
    #> route: home page; story: US002
    Given I'm on home page
    Then I should see the top selling pizzas

@wip
Scenario: Display Side dishes
    #> route: home page; story: US001
    Given I'm on home page
    Then I should see the list of side dishes

@skip
Scenario: Display offers
    #> route: home page; story: US001
    Given I'm on home page
    Then I should see the general offers

Rule: Find relevant products

Scenario: Search for a pizza
    Given I'm on any page
    #> story: US003
    When I search pizza by "cheese"
    Then it should result all pizzas
    #> story: US003
    When I search pizza by "mushroom"
    Then it should result following pizzas
    #>[]
    | Farm House |
    | Deluxe Veggie |
    | Veg Extravaganza |

Rule: Create a cart

Scenario: Make an order from home page
    #> route: home page; story: US004
    Given I'm on home page
    #Save order detail in scenario context
    When I add a pizza in the cart
    #> {}
    | pizza | Farm House  |
    | extra_toppings   | onion,paneer |
    #Validate the cart from the order detail in scenario context
    Then I can see the cart with selected items

@multi
Scenario Outline: Order <pizza> pizza from product page 
    #> route: home page;
    Given I'm on home page
    #> route: product page; story: US005
    And I see detail of "<pizza>" pizza
    #Save order detail in scenario context
    When I add a pizza in the cart
    #Validate the cart from the order detail in scenario context
    Then I can see the cart with selected items

    Examples:
    | pizza |
    | Farm House |
    | Mexican Green Wave |

@2nd
    Examples:
    | pizza |
    | Veg Extravaganza |
    | Peppy Paneer |

Scenario: Make an order from product page b
    #> route: product page; story: US005
    Given I'm on "Farm House" pizza page
    #Save order detail in scenario context
    When I add a pizza in the cart
    #Validate the cart from the order detail in scenario context
    Then I can see the cart with selected items