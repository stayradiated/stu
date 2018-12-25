import sinon from 'sinon'

import mockObject from './mockObject'
import getFunctionKeys from './getFunctionKeys'
import getObjectKeys from './getObjectKeys'

const mockFunction = (fn: Function, cache: WeakMap<any, any>) => {
  const mock = Object.assign(
    sinon.stub(),
    mockObject(fn, getFunctionKeys(fn), cache))

  if (fn.hasOwnProperty('prototype')) {
    const keys = getObjectKeys(fn.prototype)
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      if (key !== 'constructor') {
        mock.prototype[key] = sinon.stub()
      }
    }
  }
  return mock
}

export default mockFunction
