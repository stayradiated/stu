import test from 'ava'

import mockObject from './mockObject'

test('should mock all functions in an object', (t) => {
  const obj = {
    fn: (): any => null,
    string: 'string',
    number: 123,
    bool: true,
    obj: {
      fn2: (): any => null,
    },
    ignore: true,
  }
  const keys = ['fn', 'string', 'number', 'bool', 'obj']
  const mocked = mockObject(obj, keys)

  t.is(typeof mocked, 'object')
  t.is(mocked.fn.isSinonProxy, true)
  t.is(mocked.string, 'string')
  t.is(mocked.number, 123)
  t.is(mocked.bool, true)
  t.is(typeof mocked.obj, 'object')
  t.is(mocked.obj.fn2.isSinonProxy, true)
  t.is(mocked.ignore, undefined)
})

test('should mock circular references', (t) => {
  class Circular {
    self: Circular
    name: string

    constructor (name: string) {
      this.self = this
      this.name = `Circular(${name})`
    }
  }

  const circular = new Circular('test')

  const mocked = mockObject(circular, ['name', 'self'])
  t.deepEqual(mocked, {
    name: 'Circular(test)',
    self: {
      name: 'Circular(test)',
      self: null,
    },
  })
})
