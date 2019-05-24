import mockFunction from './mockFunction'
import getObjectKeys from './getObjectKeys'

const mockObject = (
  obj: Record<string, any>,
  keys: string[],
  cache = new WeakMap(),
): any => {
  const mock: Record<string, any> = {}
  keys.forEach((key) => {
    const val = obj[key]

    let mockVal
    if (cache.has(val)) {
      mockVal = cache.get(val)
    } else if (typeof val === 'function') {
      cache.set(val, null)
      mockVal = mockFunction(val, cache)
      cache.set(val, mockVal)
    } else if (typeof val === 'object' && val !== null) {
      cache.set(val, null)
      mockVal = mockObject(val, getObjectKeys(val), cache)
      cache.set(val, mockVal)
    } else {
      mockVal = val
    }

    mock[key] = mockVal
  })
  return mock
}

export default mockObject
