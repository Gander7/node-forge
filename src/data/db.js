const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const { dbPath, dbName } = require('../lib/settings')()
const schema = require('./schema')

class Data {
  constructor(db, mockFs, mockLiveLogging) {
    const files = mockFs ? mockFs : fs
    const dbLocation = process.env.testing ? ':memory:' : `${dbPath}/${dbName}`

    if (!files.existsSync(dbPath)) files.mkdirSync(dbPath)
    this.db = db ? db : new Database(dbLocation)

    this.inititialize(schema, mockLiveLogging)
  }

  inititialize(schema, mockLiveLogging) {
    const qry = this.db.prepare(`select 1 from sqlite_master where type='table' and name='tasks';`)
    const stmt = qry.get()
    if (stmt === undefined) {
      if (!process.env.testing || mockLiveLogging)
        console.log(chalk.yellow('WARNING: database appears empty; initializing it.'))
      this.db.exec(schema)
      if (!process.env.testing || mockLiveLogging) console.log(chalk.green('database initialized.'))
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
