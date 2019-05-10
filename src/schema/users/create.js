const schema = {
  "$schema": "http://json-schema.org/schema#",
  "$id": "http://kyleamazza.com/schemas/users/create.json",
  "title": "Create User Schema",
  "description": "For validating client-provided Create User object",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "password": { "type": "string" },
    "profile": { "$ref": "profile.json#" }
  },
  "required": [ "email", "password" ],
  "additionalProperties": false
};

export default schema;

