const minimist = require('minimist')

// TABLES - https://www.npmjs.com/package/table

module.exports = () => {
  const args = minimist(process.argv.slice(2))

  let cmd
  if (isNaN(args._[0])) {
    cmd = args._[0] || 'list'
    if (args.version || args.v) cmd = 'version'
    if (args.help || args.h) cmd = 'help'
  } else {
    cmd = 'view'
  }

  switch (cmd) {
    case !isNaN(cmd):

    case 'a':
    case 'add':
      const addArgs = args._.slice(1)
      require('./cmds/add')(addArgs)
      break
    case 'view':
      const viewArgs = { id: parseInt(args._[0]) }
      require('./cmds/view')(viewArgs)
    case 'rem':
    case 'remove':
      require('./cmds/remove')(args._[1])
      break
    case 'd':
    case 'done':
      require('./cmds/done')(args._[1])
      break
    case 'l':
    case 'list':
      const listArgs = args._.slice(1)
      require('./cmds/list')(listArgs)
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
