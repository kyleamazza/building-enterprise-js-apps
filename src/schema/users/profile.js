const schema = {
  "$schema": "http://json-schema.org/schema#",
  "$id": "http://kyleamazza.com/schemas/users/profile.json",
  "title": "User Profile Schema",
  "description": "For validating client-provided user profile object when created and/or updating a user",
  "type": "object",
  "properties": {
    "bio": { "type": "string" },
    "summary": { "type": "string" },
    "name": { 
      "type": "object",
      "properties": {
        "first": { "type": "string" },
        "middle": { "type": "string" },
        "last": { "type": "string" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
};

export default schema;

