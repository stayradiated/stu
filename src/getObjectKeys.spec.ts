import test from 'ava'

import getObjectKeys from './getObjectKeys'

test('should get any custom object keys', (t) => {
  const obj = { a: 1, b: 2, c: 3 }
  t.deepEqual(getObjectKeys(obj), ['a', 'b', 'c'])
})
