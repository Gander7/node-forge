const { version } = require('../../package.json')

const printVersion = () => {
  console.log(`Node Task Warrior version v${version}`)
}

module.exports = printVersion
