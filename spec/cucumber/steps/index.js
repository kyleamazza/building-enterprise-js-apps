import { When, Then } from 'cucumber';
import assert from 'assert';
import superagent from 'superagent';

// NOTENOTENOTENOETNOTE: If you don't need to run the `callback` function, do NOT include it in the function signature!!!!!!!!!!!!!!!!

// These steps build up the action, which is sent in the final `When` function
When(/^the client creates a POST request to \/users$/, function () {
  const { SERVER_PROTOCOL, SERVER_HOSTNAME, SERVER_PORT } = process.env;
  const url = `${SERVER_PROTOCOL}://${SERVER_HOSTNAME}:${SERVER_PORT}/users`;
  this.request = superagent('POST', url);
});

When(/^attaches a generic empty payload$/, function () {
  // By default superagent attaches an empty payload if none is specified.
  return undefined;
});

When(/^attaches a generic non-JSON payload$/, function () {
  this.request.send('<?xml version="1.0" encoding="UTF-8"?><email>kyle@kyle.com</email>');
  this.request.set('Content-Type', 'text/xml');
});

When(/^attaches a generic malformed payload$/, function () {
  this.request.send('{"email": "kyle@kyle.com", name: }');
  this.request.set('Content-Type', 'application/json');
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

Then(/^our API should respond with a 400 HTTP status code$/, function () {
  assert.equal(this.response.statusCode, 400);
});

Then(/^our API should respond with a 415 HTTP status code$/, function () {
  assert.equal(this.response.statusCode, 415);
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

Then(/^contains a message property which says "Payload should not be empty"$/, function () {
  assert.equal(this.responsePayload.message, 'Payload should not be empty');
});

Then(/^contains a message property which says "Payload should be in JSON format"$/, function () {
  assert.equal(this.responsePayload.message, 'Payload should be in JSON format');
});

Then(/^contains a message property which says \'The "Content-Type" header must always be "application\/json"\'$/, function () {
  assert.equal(this.responsePayload.message, 'The "Content-Type" header must always be "application/json"');
});

