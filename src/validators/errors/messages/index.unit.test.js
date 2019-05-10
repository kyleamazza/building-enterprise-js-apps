import { expect } from 'chai';

import generateValidationErrorMessage from '.';

describe('generateValidationErrorMessage', function () {
  it('should return the correct string when `error.keyword` is "required"', function () {
    const errors = [{
      keyword: 'required',
      dataPath: '.test.path',
      params: {
        missingProperty: 'property'
      }
    }];

    const actual = generateValidationErrorMessage(errors);
    const expected = "The '.test.path.property' field is missing";

    expect(expected).to.be.equal(actual);
  });

  it('should return the correct string when `error.keyword` is "type"', function () {
    const errors = [{
      keyword: 'type',
      dataPath: '.test.path',
      params: {
        type: 'string'
      }
    }];

    const actual = generateValidationErrorMessage(errors);
    const expected = "The '.test.path' field must be of type 'string'";

    expect(expected).to.be.equal(actual);
  });

  it('should return the correct string when `error.keyword` is "format"', function () {
    const errors = [{
      keyword: 'format',
      dataPath: '.test.path',
      params: {
        format: 'email'
      }
    }];

    const actual = generateValidationErrorMessage(errors);
    const expected = "The '.test.path' field must be a valid email";

    expect(expected).to.be.equal(actual);
  });

  it('should return the correct string when `error.keyword` is "additionalProperties"', function () {
    const errors = [{
      keyword: 'additionalProperties',
      dataPath: '.test.path',
      params: {
        additionalProperty: 'email'
      }
    }];

    const actual = generateValidationErrorMessage(errors);
    const expected = "The '.test.path' object does not support the field 'email'";

    expect(expected).to.be.equal(actual);
  });
});
