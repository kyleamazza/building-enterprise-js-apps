import { When, Then } from 'cucumber';
import assert from 'assert';
import superagent from 'superagent';

// NOTENOTENOTENOETNOTE: If you don't need to run the `callback` function, do NOT include it in the function signature!!!!!!!!!!!!!!!!

// These steps build up the action, which is sent in the final `When` function
When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:/]+)$/, function (method, path) {
  const { SERVER_PROTOCOL, SERVER_HOSTNAME, SERVER_PORT } = process.env;
  const url = `${SERVER_PROTOCOL}://${SERVER_HOSTNAME}:${SERVER_PORT}${path}`;
  this.request = superagent(method, url);
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{ "name": "john", {')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send('<?xml version="1.0" encoding="UTF-8"?><email>kyle@kyle.com</email>')
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
      // Implicitly returns undefined, but we'll make it explicit here
      return undefined;
  }
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
  const payload = {
    email: 'e@ma.il',
    password: 'password'
  };

  const fieldsToDelete = missingFields
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');

  fieldsToDelete.forEach(field => delete payload[field]);

  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? of types? ([a-zA-Z]+)$/, function(payloadType, fields, invert, type) {
  const payload = {
    email: 'e@ma.il',
    password: 'password'
  };

  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    string: {
      is: 'this is a string',
      not: 10
    }
  };

  const fieldsToModify = fields
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');

  fieldsToModify.forEach((field) => {
    payload[field] = sampleValues[typeKey][invertKey];
  });

  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) { 
  this.request.unset(headerName);
});

When(/^sends the request$/, function (cb) {
  this.request
    .then((response) => {
      this.response = response.res;
      cb();
    })
    .catch((err) => {
      this.response = err.response;
      cb();
    });
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be a JSON object$/, function () {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];

  // We want the Content-Type to be declared as application/json
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type: application/json');
  }

  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (err) {
    throw new Error('Response is not a valid JSON object');
  }
});

// NOTE: This regex basically helps determine whether the message has double/single quotes, and matches based on that.
// The (?:...|...) syntax represents a "non-capturing" group. That is, the group is used to match, but is not itself concluded in the final regex string.
Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

