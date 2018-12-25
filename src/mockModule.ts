import sinon from 'sinon'

import getObjectKeys from './getObjectKeys'
import mockFunction from './mockFunction'
import mockObject from './mockObject'

const mockModule = (module: any) => {
  const cache = new WeakMap()
  let mock
  if (typeof module === 'function') {
    mock = mockFunction(module, cache)
  } else {
    mock = mockObject(module, getObjectKeys(module), cache)
  }
  return mock
}

export default mockModule
