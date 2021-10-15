Feature: Cytorus should use host network from docker to test locally running applications on any port

Start local app before running this featue file
node local-app/server.js

Scenario: application running on localhost
    #Given I start local app
    Then I can access the application