# Cytorus

Cypress File Preprocessor to run Gherkin based tests with some mind blowing features.

## Features

* **Threshold** based approach to pass/fail a build.
* Run tests for or from a particular **route**.
* Run tests going through particular route.
* Run tests from their **position** in test file(s).
* Run tests for a **User Story**.
* Write your own **custom reporting** tools/
* More readable/understandable **data tables**.
* **Parallel runs** (experimental)

## Feature file

```gherkin
#!
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

Rule: Find relevant products

@skip
Scenario: Search for a pizza
    #> story: US003
    Given I'm on any page
    When I search for "cheese"
    Then it should result all pizzas
    When I search for "mushroom"
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
    When I add following items in the cart
    #> {}
    | pizza | Farm House  |
    | extra_toppings   | onion,paneer |
    #Validate the cart from the order detail in scenario context
    Then I can see the cart with selected items
```

## User Guide

For further documentation see [docs](./docs/1.GettingStarted.md)

## Some Useful Commands

```bash
npx cytorus run --story "US004"
npx cytorus run --tags "not @wip"
npx cytorus run --from "product page"
npx cytorus run --not-via "home page"
```