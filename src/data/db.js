const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const { dbPath, dbName } = require('../lib/settings')
const schema = require('./schema')

class Data {
  constructor(db, mockFs, logDuringTest) {
    const files = mockFs ? mockFs : fs
    this.testing = process.env.testing
    if (!files.existsSync(dbPath)) files.mkdirSync(dbPath)
    const dbLocation = this.testing ? ':memory:' : `${dbPath}/${dbName}`
    this.db = db ? db : new Database(dbLocation)
    this.inititialize(schema, logDuringTest)
  }

  inititialize(schema, logDuringTest) {
    const row = this.db
      .prepare(`select 1 from sqlite_master where type='table' and name='tasks';`)
      .get()
    if (row === undefined) {
      if (!this.testing || logDuringTest)
        console.log(chalk.yellow('WARNING: database appears empty; initializing it.'))
      this.db.exec(schema)
      if (!this.testing || logDuringTest) console.log(chalk.green('database initialized.'))
    }
  }

  insert(args) {
    const qry = `
        insert into tasks (id, desc)
        values ((select max(nextid) + 1 from settings), :desc);
      `
    const stmt = this.db.prepare(qry)
    const settingsQry = `update settings set nextid = nextid + 1`
    const settingsStmt = this.db.prepare(settingsQry)

    let retVal
    this.db.transaction(() => {
      retVal = stmt.run(args)
      settingsStmt.run()
    })()

    return retVal
  }

  getOne(id) {
    const qry = `select * from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)
    return stmt.get(id)
  }

  getAll() {
    const qry = `select rowid, desc from tasks`
    const stmt = this.db.prepare(qry)
    return stmt.all()
  }

  remove(id) {
    const qry = `delete from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)
    return stmt.run(id)
  }

  archive(id) {
    const task = this.getOne(id)
    const qry = `insert into archivedTasks 
      (desc, archivedOn, oldTaskId)
      select desc, datetime('now'), id
      from tasks where rowid = ?`
    const archiveStmt = this.db.prepare(qry)

    const run = this.db.transaction(() => {
      archiveStmt.run(id)
      this.remove(id)
    })
    run()

    return task ? task.id : undefined
  }
}

module.exports = Data
