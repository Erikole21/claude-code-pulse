let silent = false

export function setSilent(value: boolean): void {
  silent = value
}

export function log(...args: unknown[]): void {
  if (!silent) console.log(...args)
}

export function warn(...args: unknown[]): void {
  if (!silent) console.warn(...args)
}

export function success(...args: unknown[]): void {
  if (!silent) console.log(...args)
}

export function error(...args: unknown[]): void {
  console.error(...args)
}
