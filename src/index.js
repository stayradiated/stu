import caller from 'caller'
import {mock} from './core'
import {flushWithContext} from 'unwire'

export default function stu (fn) {
  const context = caller()
  let modulePaths = new Set()

  const exports = {
    mock: () => {
      const result = mock(fn, context)
      modulePaths = new Set([...modulePaths, ...result.modulePaths])
      return result.returnValue
    },
    flush: () => {
      modulePaths.forEach((modulePath) => {
        return flushWithContext(modulePath, context)
      })
    },
    mocha: () => {
      after(exports.flush)
      beforeEach(exports.mock)
    },
  }

  return exports
}
