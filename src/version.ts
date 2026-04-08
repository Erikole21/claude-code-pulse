import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

let cached: string | undefined

export function getVersion(): string {
  if (!cached) {
    // Try multiple relative paths to handle both src/ and dist/ execution
    try {
      cached = require('../package.json').version
    } catch {
      try {
        cached = require('../../package.json').version
      } catch {
        cached = '0.0.0'
      }
    }
  }
  return cached!
}
