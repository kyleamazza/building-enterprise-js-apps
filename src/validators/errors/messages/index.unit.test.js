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
});
