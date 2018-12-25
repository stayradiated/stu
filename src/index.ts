import caller from 'caller'
import { replaceWithContext, mockWithContext, flushWithContext } from 'unwire'

import mockModule from './mockModule'

const mock = (modulePath: string, mockFn = mockModule) => {
  const context = caller()
  return mockWithContext(modulePath, context, mockFn)
}

const overwrite = (modulePath: string, value: any) => {
  const context = caller()
  return replaceWithContext(modulePath, context, value)
}

const test = (modulePath: string) => {
  const context = caller()
  flushWithContext(modulePath, context)
  return mockWithContext(modulePath, context)
}

const flush = (modulePath: string) => {
  const context = caller()
  return flushWithContext(modulePath, context)
}

export {
  mock,
  overwrite,
  test,
  flush
}
