import assert from 'assert'
import stu from '../src/index'
import {describe, it, beforeEach, after} from 'mocha'

describe('square', function () {
  let multiply
  let square
  let Car
  let drive

  const modules = stu(function (mock, test) {
    multiply = mock('./multiply')
    square = test('./square')

    Car = mock('./car')
    drive = test('./drive')
  })

  beforeEach(modules.mock)
  after(modules.flush)

  it('should square 5', function () {
    multiply.returns(25)

    assert.equal(square(5), 25)

    assert(multiply.calledWith(5, 5))
    assert(multiply.calledOnce)
  })

  it('should square 10', function () {
    multiply.returns(100)

    assert.equal(square(3), 100)

    assert(multiply.calledWith(3, 3))
    assert(multiply.calledOnce)
  })

  it('should drive a car', function () {
    Car.prototype.drive.returns('123')
    assert.equal(drive(), '123')
  })
})
