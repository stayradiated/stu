import {unwireWithContext, flushWithContext} from 'unwire'
import sinon from 'sinon'

export function mockFunction (fn) {
  let mock = sinon.stub()
  if (fn.hasOwnProperty('prototype')) {
    const props = Object.getOwnPropertyNames(fn.prototype)
    for (let i = 0, len = props.length; i < len; i++) {
      let key = props[i]
      if (key !== 'constructor') {
        mock.prototype[key] = sinon.stub()
      }
    }
  }
  return mock
}

export function mockObject (obj) {
  let mock = sinon.stub()
  const props = Object.getOwnPropertyNames(obj)
  for (let i = 0, len = props.length; i < len; i++) {
    let key = props[i]
    if (typeof obj[key] === 'function') {
      mock[key] = mockFunction(obj[key])
    } else {
      mock[key] = obj
    }
  }
  return mock
}

export function mockModule (module) {
  let mock
  if (typeof module === 'function') {
    mock = mockFunction(module)
  } else {
    mock = mockObject(module)
  }
  return mock
}

export function mockModulePath (modulePath, context) {
  return unwireWithContext(modulePath, context, mockModule)
}

export function mock (fn, context) {
  const modulePaths = new Set()

  const mock = function (modulePath) {
    modulePaths.add(modulePath)
    return mockModulePath(modulePath, context)
  }

  const test = function (modulePath) {
    modulePaths.add(modulePath)
    flushWithContext(modulePath, context)
    return unwireWithContext(modulePath, context)
  }

  const returnValue = fn(mock, test)

  return {modulePaths, returnValue}
}

export function cleanup (modules, context) {
  modules.forEach(module => flushWithContext(module, context))
}
