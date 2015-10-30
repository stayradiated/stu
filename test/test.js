import assert from 'assert';
import stu from '../src/index';

describe('square', function () {
  var cleanup;

  var multiply;
  var square;

  beforeEach(function () {
    cleanup = stu(function (mock, test) {
      multiply = mock('./multiply');
      square = test('./square');
    });
  });

  after(() => cleanup());

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
