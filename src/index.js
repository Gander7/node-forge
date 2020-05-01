const minimist = require('minimist')

// TABLES - https://www.npmjs.com/package/table

module.exports = () => {
  const args = minimist(process.argv.slice(2))
  console.log(args)

  let cmd = args._[0] || 'help'
  if (args.version || args.v) cmd = 'version'
  if (args.help || args.h) cmd = 'help'

  switch (cmd) {
    case 'a':
    case 'add':
      const taskArgs = args._.slice(1)
      const task = require('./cmds/add')(taskArgs)
      console.log(task)
      break
    case 'version':
      require('./cmds/version')()
      break
    case 'help':
      require('./cmds/help')()
      break
    default:
      console.error(`"${cmd}" is not a valid command!`)
  }
}
