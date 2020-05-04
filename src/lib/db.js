const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const { dbPath, dbName, dbOutput } = require('./settings')
const { createDB } = require('./createDB')

// Create Directory if needed
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)

// Open database
const db = new Database(`${dbPath}/${dbName}.db`, {
  verbose: dbOutput,
})

// Create Schema if it doesn't exist
const stmt = db.prepare(`
    SELECT 1 
    from sqlite_master 
    WHERE type='table' and name='tasks';`)
const row = stmt.get()

if (row === undefined) {
  console.log(chalk.yellow('WARNING: database appears empty; initializing it.'))
  createDB(db)
  console.log(chalk.green('database initialized.'))
}

module.exports = db
