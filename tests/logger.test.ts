import { afterEach, describe, expect, it, vi } from 'vitest'
import { error, log, setSilent, success, warn } from '../src/utils/logger.js'

describe('logger', () => {
  afterEach(() => {
    setSilent(false)
    vi.restoreAllMocks()
  })

  it('suppresses log, warn, success when silent; still errors', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    setSilent(true)
    log('a')
    warn('b')
    success('c')
    error('d')

    expect(logSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errSpy).toHaveBeenCalledWith('d')
  })
})
