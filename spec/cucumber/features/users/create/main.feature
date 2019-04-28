# Remember: every (non-empty) *must* start with a Gherkin keyword
# Name of feature, description of feature
Feature: Create User 
  Clients should be able to send a request to our API in order to create a user. Our API should also validate the structure of the payload and respond with an error if it is invalid.

  # Name of scenario, description of scenario
  Scenario Outline: Bad Client Requests
    If the client sends a POST request to /users with an unsupported payload, it should receive a response with a 4xx Bad Request HTTP status code.

    When the client creates a POST request to /users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

    Examples:
      | payloadType | statusCode  | message                                                       |
      | empty       | 400         | "Payload should not be empty"                                 | 
      | non-JSON    | 415         | 'The "Content-Type" header must always be "application/json"' |
      | malformed   | 400         | "Payload should be in JSON format"                            |
