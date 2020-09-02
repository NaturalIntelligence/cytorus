@all
Feature: test tag expressions, default tags, and scenario sequence

Use following commands to run this file

@first
Scenario: should run on `@all`, `@first` expressions
    Given I start here

@only
Scenario: should run when tag expression is not given
    Given I start here

@skip
Scenario: should be skipped always
    Given I start here

@4th @fourth
Scenario: should run on `@all`, `@4th`, `@fourth` expressions
    Given I start here

