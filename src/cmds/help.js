const chalk = require('chalk')
const figlet = require('figlet')
const { version } = require('../../package.json')

const menus = {
  main: `${chalk.green(figlet.textSync('Task Forge', { horizontalLayout: 'full' }))}
    version v${version}

    ${chalk.greenBright('task [command] <options|filters>')}
    See individual command menus for options|filters

    ${chalk.underline.magenta('Commands')}
    ${chalk.blueBright('add|a        <text>          ')}...... add task
    ${chalk.blueBright('view         <taskId>        ')}...... view task
    ${chalk.blueBright('list|l                       ')}...... view task, default command
    ${chalk.blueBright('modify|mod|m <taskId> <text> ')}...... modifies task (overwrites)
    ${chalk.blueBright('append|app   <taskId> <text> ')}...... appends text to task
    ${chalk.blueBright('done|d       <taskId>        ')}...... archives task
    ${chalk.blueBright('restore|res  <taskId>        ')}...... restores a completed task
    ${chalk.blueBright('remove|rem   <taskId>        ')}...... permanently deletes task


    ${chalk.underline.magenta('Global Flags')}
    ${chalk.blueBright('-v|--version ')}...................... show current version
    ${chalk.blueBright('-h|--help    ')}...................... show usage
 
    ${chalk.underline.yellow(`Loki: We are not doing 'Get Help'`)}
  `,
}

const getHelp = () => {
  console.log(menus.main)
}

module.exports = getHelp
