const chalk = require('chalk')
const figlet = require('figlet')
const { version } = require('../../package.json')

const getHelp = () => {
  console.log()
  console.log(chalk.green(figlet.textSync('Task Forge', { horizontalLayout: 'full' })))
  console.log(`version v${version}`)
  console.log()
  console.log(chalk.underline.yellow(`Loki: We are not doing 'Get Help'`))
  console.log()
}

module.exports = getHelp
