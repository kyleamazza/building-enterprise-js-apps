import { expect } from 'chai';

import ValidationError from '.';

describe('ValidationError', function () {
  beforeEach(function () {
    this.validationError = new ValidationError();
  });

  it('should be a subclass of `Error`', function () {
    expect(this.validationError).to.be.an.instanceof(Error);
  });

  describe('constructor', function () {
    it('should make the constructor parameter accessible via the `message` property of the instance', function () {
      const TEST_ERROR_MESSAGE = 'TEST_ERROR_MESSAGE';
      this.validationError = new ValidationError(TEST_ERROR_MESSAGE);

      expect(this.validationError.message).to.be.equal(TEST_ERROR_MESSAGE);
    });

    it('should make the `message` property of the instance accessible', function () {
      const TEST_ERROR_MESSAGE = 'TEST_ERROR_MESSAGE';
      this.validationError.message = TEST_ERROR_MESSAGE;

      expect(this.validationError.message).to.be.equal(TEST_ERROR_MESSAGE);
    });
  });
});
