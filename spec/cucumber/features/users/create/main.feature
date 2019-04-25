# Remember: every (non-empty) *must* start with a Gherkin keyword
# Name of feature, description of feature
Feature: Create User 
  Clients should be able to send a request to our API in order to create a user. Our API should also validate the structure of the payload and respond with an error if it is invalid.

  # Name of scenario, description of scenario
  Scenario: Empty Payload
    If the client sends a POST request to /users with an unsupported payload, it should receive a response with a 4xx status code.

    # Generally, a scenario can be broken up into 3 steps:
    # 1. Setup: Sets up the environment in preparation of an action (`Given`)
    # 2. Action: Action is executed (i.e. the event that we're testing for). (`When`)
    # 3. Assertions: Asserts whether the outcome is the same as the expected. (`Then`)
    # The keywords `And` and `But` is used to add additional actions/assertions etc.

    When the client creates a POST request to /users
    And attaches a generic empty payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload should not be empty"
