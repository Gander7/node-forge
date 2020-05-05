const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const { dbPath, dbName } = require('../lib/settings')
const schema = require('./schema')

class Data {
  constructor(db, mockFs) {
    const files = mockFs ? mockFs : fs
    if (!files.existsSync(dbPath)) files.mkdirSync(dbPath)
    this.db = db ? db : new Database(`${dbPath}/${dbName}.db`)
    this.inititialize(schema)
  }

  inititialize(schema) {
    const row = this.db
      .prepare(`select 1 from sqlite_master where type='table' and name='tasks';`)
      .get()
    if (row === undefined) {
      console.log(chalk.yellow('WARNING: database appears empty; initializing it.'))
      this.db.exec(schema)
      console.log(chalk.green('database initialized.'))
    }
  }

  insert(args) {
    const qry = `
        insert into tasks (id, desc)
        values ((select ifnull(max(id),0) + 1 from tasks), :desc);
      `
    const stmt = this.db.prepare(qry)
    return stmt.run(args)
  }

  getAll() {
    const qry = `select rowid, desc from tasks`
    const stmt = this.db.prepare(qry)
    return stmt.all()
  }

  delete(args) {
    const qry = `delete from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)
    return stmt.run(args)
  }

  cleanTable(tableName) {
    const qry = `delete from ${tableName}`
    const stmt = this.db.prepare(qry)
    return stmt.run()
  }
}

module.exports = Data
