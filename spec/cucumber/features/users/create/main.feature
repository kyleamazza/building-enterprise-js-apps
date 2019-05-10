# Remember: every (non-empty) *must* start with a Gherkin keyword
# Name of feature, description of feature
Feature: Create User 
  Clients should be able to send a request to our API in order to create a user. Our API should also validate the structure of the payload and respond with an error if it is invalid.

  # Name of scenario, description of scenario
  Scenario Outline: Bad Client Requests
    If the client sends a POST request to /users with an unsupported payload, it should receive a response with a 4xx Bad Request HTTP status code.

    When the client creates a POST request to /users
    And attaches a generic <payloadType> payload
    And with a "Content-Type" header set with value "<contentType>"
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

    Examples:
      | payloadType | contentType       | statusCode  | message                                                       |
      | empty       | text/plain        | 400         | 'Payload should not be empty'                                 | 
      | non-JSON    | text/xml          | 415         | 'The "Content-Type" header must always be "application/json"' |
      | malformed   | application/json  | 400         | 'Payload should be in JSON format'                            |

  Scenario Outline: Bad Request Payload
    If the client sends a POST request to /users with a payload with missing fields, it should receive a response with a 4xx Bad Request HTTP status code.

    When the client creates a POST request to /users
    And attaches a Create User payload which is missing the <missingFields> field
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "<message>"

    Examples:
      | missingFields   | message                           |
      | email           | The '.email' field is missing     |
      | password        | The '.password' field is missing  |

  Scenario Outline: Payload with Properties of Unsupported Type
    If the client sends a POST request to /users with fields of unsupported datatypes, it should receive a response with a 4xx Bad Request HTTP status code.

    When the client creates a POST request to /users
    And attaches a Create User payload where the <field> field is not of type <type>
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "The '.<field>' field must be of type '<type>'"

    Examples:
      | field     | type    |
      | email     | string  |
      | password  | string  |
    
  Scenario Outline: Request Payload with Invalid Email Format
    If the client sends a POST request to /users with an email field with an invalid format, it should receive a response with a 4xx Bad Request HTTP status code.

    When the client creates a POST request to /users
    And attaches a Create User payload where the email field is exactly <email>
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "The '.email' field must be a valid email"

    Examples:
      | email       |
      | a23juqy2    |
      | a@1.2.3.4   |
      | a,b,c@!!    |
      | kyle@maz.z@ |

  Scenario: Minimal Valid User
    If a client sends a POST request to /users with a valid email field and a valid password field, it should receive a response with a 201 Created HTTP status code.

    When the client creates a POST request to /users
    And attaches a valid Create User payload
    And with a "Content-Type" header set with value "application/json"
    And sends the request
    Then our API should respond with a 201 HTTP status code
    And the payload of the response should be a string
    And the payload object should be added to the database, grouped under the "user" type
    And the newly-created user should be deleted
    
  Scenario Outline: Invalid Profile Creation Payload
    If a client sends a POST request to /users with an invalid profile payload, it should receive a response with a 400 HTTP status code.

    When the client creates a POST request to /users
    And attaches <payload> as the JSON payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "<message>"

    Examples:
      | payload                                                                           | message                                                   |
      | {"email":"e@ma.il","password":"abc","profile":{"foo":"bar"}}                      | The '.profile' object does not support the field 'foo'    |
      | {"email":"e@ma.il","password":"abc","profile":{"name":{"first":"Jan","a":"b"}}}   | The '.profile.name' object does not support the field 'a' |
      | {"email":"e@ma.il","password":"abc","profile":{"summary":true}}                   | The '.profile.summary' field must be of type 'string'     |
      | {"email":"e@ma.il","password":"abc","profile":{"bio":0}}                          | The '.profile.bio' field must be of type 'string'         | 

  Scenario Outline: Valid Profile
    If a client sends a POST request to /users with a valid profile payload, it should receive a response with a 201 Created HTTP status code.

    When the client creates a POST request to /users
    And attaches <payload> as the JSON payload
    And sends the request
    Then our API should respond with a 201 HTTP status code
    And the payload of the response should be a string
    And the payload object should be added to the database, grouped under the "user" type
    And the newly-created user should be deleted

    Examples:
      | payload                                                                       |
      | {"email":"e@ma.il","password":"password","profile":{}}                        |
      | {"email":"e@ma.il","password":"password","profile":{"name":{"first":"Kyle"}}} |
      | {"email":"e@ma.il","password":"password","profile":{"bio":"bio"}}             |
      | {"email":"e@ma.il","password":"password","profile":{"summary":"summary"}}     |
