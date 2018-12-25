import test from 'ava'

import getFunctionKeys from './getFunctionKeys'

test('should get any custom function keys', (t) => {
  const fn = function () {}
  fn.a = 1
  fn.b = 2
  fn.c = 3

  t.deepEqual(getFunctionKeys(fn), [
    'a', 'b', 'c',
  ])
})

