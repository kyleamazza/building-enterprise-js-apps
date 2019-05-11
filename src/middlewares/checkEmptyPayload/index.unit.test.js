import chai, { expect } from 'chai';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import cloneDeep from 'lodash.clonedeep';

import checkEmptyPayload from '.';

chai.use(sinonChai);

describe('checkEmptyPayload', function () {
  let req;
  let res;
  let next;
  describe('When req.method is not one of POST, PATCH, or PUT', function () {
    let clonedRes;

    beforeEach(function () {
      req = mockReq({ method: 'GET' });
      res = {};
      next = spy();
      clonedRes = cloneDeep(res);
      checkEmptyPayload(req, res, next);
    });

    it('should not modify `res`', function () {
      expect(res).to.be.eql(clonedRes);
    });

    it('should call next() once', function () {
      expect(next).to.have.been.calledOnce;
    });
  });

  (['POST', 'PATCH', 'PUT']).forEach((method) => {
    describe(`When req.method is ${method}`, function () {
      describe('and the "Content-Length" header is not equal to "0"', function () {
        let clonedRes;

        beforeEach(function () {
          req = mockReq({
            method,
            headers: { 'content-length': '1' }
          });
          res = mockRes();

          next = spy();

          clonedRes = cloneDeep(res);

          checkEmptyPayload(req, res, next);
        });

        it('should not modify res', function () {
          expect(res).to.be.eql(clonedRes);
        });

        it('should call next() once', function () {
          expect(next).to.have.been.calledOnce;
        });
      });

      describe('and the "Content-Length" header is equal to "0"', function () {
        let returnValue;
        let expectedReturnValue;

        beforeEach(function () {
          req = mockReq({
            method,
            headers: { 'content-length': '0' }
          });

          expectedReturnValue = {};

          res = mockRes({ json: stub().returns(expectedReturnValue) });

          next = spy();

          returnValue = checkEmptyPayload(req, res, next);
        });

        describe('should call res.status()', function () {
          it('once', function () {
            expect(res.status).to.have.been.calledOnce;
          });

          it('with the argument 400', function () {
            expect(res.status).to.have.been.calledOnceWithExactly(400);
          });
        });

        describe('should call res.set()', function () {
          it('once', function () {
            expect(returnValue).to.be.eql(expectedReturnValue);
          });

          it('with the arguments "Content-Type" and "application/json"', function () {
            expect(res.set).to.have.been.calledOnceWithExactly('Content-Type', 'application/json');
          });
        });

        describe('should call res.json()', function () {
          it('once', function () {
            expect(res.json).to.have.been.calledOnce;
          });

          it('with the arguments "Content-Type" and "application/json"', function () {
            expect(res.json).to.have.been.calledOnceWithExactly({ message: 'Payload should not be empty' });
          });
        });

        it('should not call next()', function () {
          expect(next).to.not.have.been.called;
        });

        it('should return the value returned by `res.json()`', function () {
          expect(expectedReturnValue).to.be.equal(returnValue);
        });
      });
    });
  });
});
