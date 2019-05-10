import { When, Then } from 'cucumber';
import assert from 'assert';
import superagent from 'superagent';
import elasticsearch from 'elasticsearch';

import { getValidPayload, convertStringToArray } from './utils';

// NOTENOTENOTENOETNOTE: If you don't need to run the `callback` function,
// do NOT include it in the function signature!!!!!!!!!!!!!!!!

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`
});

// These steps build up the action, which is sent in the final `When` function
When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:/]+)$/, function (method, path) {
  const { SERVER_PROTOCOL, SERVER_HOSTNAME, SERVER_PORT } = process.env;
  const url = `${SERVER_PROTOCOL}://${SERVER_HOSTNAME}:${SERVER_PORT}${path}`;
  this.request = superagent(method, url);
});

When(/^attaches (.+) as the JSON payload$/, function (payload) {
  this.requestPayload = JSON.parse(payload);
  this.request
    .send(payload)
    .set('Content-Type', 'application/json');
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);

  this.request
    .send(JSON.stringify(this.requestPayload));
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(missingFields);

  fieldsToModify.forEach(field => delete this.requestPayload[field]);

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? of types? ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(fields);

  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    string: {
      is: 'this is a string',
      not: 10
    }
  };

  fieldsToModify.forEach((field) => {
    this.requestPayload[field] = sampleValues[typeKey][invertKey];
  });

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches a (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
  this.requestPayload = getValidPayload(payloadType);
  const fieldsToModify = convertStringToArray(fields);

  fieldsToModify.forEach((field) => {
    this.requestPayload[field] = value;
  });

  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request
    .send(JSON.stringify(this.requestPayload));
});

When(/^with a (?:"|')([\w-]+)(?:"|') header set with value (?:"|')([\w]+\/[\w]+)(?:"|')$/, function (headerName, value) {
  this.request.set(headerName, value);
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

Then(/^the payload of the response should be a? ([a-zA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];

  if (payloadType === 'JSON object') {
    // We want the Content-Type to be declared as application/json
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of Content-Type: application/json');
    }

    try {
      this.responsePayload = JSON.parse(this.response.text);
    } catch (err) {
      throw new Error('Response is not a valid JSON object');
    }
  } else if (payloadType === 'string') {
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of Content-Type text/plain');
    }

    this.responsePayload = this.response.text;
    if (typeof this.responsePayload !== 'string') {
      throw new Error('Response not a string');
    }
  }
});

// NOTE: This regex basically helps determine whether the message has double/single quotes,
// and matches based on that.
// The (?:...|...) syntax represents a "non-capturing" group.
// That is, the group is used to match, but is not itself concluded in the final regex string.
Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

Then(/^the payload object should be added to the database, grouped under the (?:"|')([a-zA-Z]+)(?:"|') type$/, async function (type) {
  this.type = type;
  try {
    const result = await client.get({
      index: process.env.ELASTICSEARCH_INDEX,
      type: this.type,
      id: this.responsePayload
    });
    
    assert.deepEqual(result._source, this.requestPayload);
  } catch (e) {
    return e;
  }
});

Then(/^the newly\-created user should be deleted$/, async function () {
  try {
    const result = await client.delete({
      index: process.env.ELASTICSEARCH_INDEX,
      type: this.type,
      id: this.responsePayload
    });

    assert.equal(res.result, 'deleted');
  } catch (e) {
    return e;
  }
});

