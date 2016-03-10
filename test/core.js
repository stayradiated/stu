import expect from 'expect'

import * as core from '../src/core'

describe('core', () => {
  describe('getObjectKeys', () => {
    it('should get any custom object keys', () => {
      const obj = {a: 1, b: 2, c: 3}
      expect(core.getObjectKeys(obj)).toEqual([
        'a', 'b', 'c',
      ])
    })
  })

  describe('getFunctionKeys', () => {
    it('should get any custom function keys', () => {
      const fn = function () {}
      fn.a = 1
      fn.b = 2
      fn.c = 3
      expect(core.getFunctionKeys(fn)).toEqual([
        'a', 'b', 'c',
      ])
    })
  })

  describe('mockFunction', () => {
  })

  describe('mockObject', () => {
    it('should mock all functions in an object', () => {
      const obj = {
        fn: () => null,
        string: 'string',
        number: 123,
        bool: true,
        obj: {
          fn2: () => null,
        },
        ignore: true,
      }
      const keys = ['fn', 'string', 'number', 'bool', 'obj']
      const mocked = core.mockObject(obj, keys)
      expect(mocked).toBeAn('object')
      expect(mocked.fn.isSinonProxy).toBe(true)
      expect(mocked.string).toBe('string')
      expect(mocked.number).toBe(123)
      expect(mocked.bool).toBe(true)
      expect(mocked.obj).toBeAn('object')
      expect(mocked.obj.fn2.isSinonProxy).toBe(true)
      expect(mocked.ignore).toBe(undefined)
    })
  })
})
