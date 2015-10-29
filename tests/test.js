var assert = require('assert');
var mock = require('../index').default;
var flush = require('../index').flush;

describe('square', function () {
  var multiply;
  var square;

  beforeEach(function () {
    multiply = mock('./multiply');
    square = require('./square');
  });

  afterEach(function () {
    flush('./square');
  });

  it('should square 5', function () {
    multiply.returns(25);

    assert.equal(square(5), 25);

    assert(multiply.calledWith(5, 5));
    assert(multiply.calledOnce);
  });

  it('should square 10', function () {
    multiply.returns(100);

    assert.equal(square(3), 100);

    assert(multiply.calledWith(3, 3));
    assert(multiply.calledOnce);
  });
});
