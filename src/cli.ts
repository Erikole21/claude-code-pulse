import { createRequire } from 'node:module'
import { Command } from 'commander'
import { registerInit } from './commands/init.js'
import { registerSync } from './commands/sync.js'
import { registerGreet } from './commands/greet.js'
import { registerList } from './commands/list.js'
import { registerStatus } from './commands/status.js'
import { registerUninstall } from './commands/uninstall.js'
import { registerMemory } from './commands/memory.js'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const program = new Command()

program
  .name('pulse')
  .version(pkg.version)
  .description(pkg.description)
  .configureOutput({
    writeErr: (str) => process.stderr.write(str),
    writeOut: (str) => process.stdout.write(str),
  })

registerInit(program)
registerSync(program)
registerGreet(program)
registerList(program)
registerStatus(program)
registerUninstall(program)
registerMemory(program)

program.parse()
