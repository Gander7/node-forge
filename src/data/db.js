const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const schema = require('./schema')

class Data {
  constructor(db, mockFs, mockLiveLogging) {
    const files = mockFs ? mockFs : fs
    let { dbPath, dbName, dbFullPath } = this.getPath()

    if (dbName.includes(':memory:')) {
      dbFullPath = ':memory:'
    } else {
      if (!files.existsSync(dbPath)) {
        files.mkdirSync(dbFullPath)
      }
    }

    this.db = db ? db : new Database(dbFullPath)

    this.inititialize(schema, mockLiveLogging)
  }

  getPath() {
    const { dbPath, dbName } = require('../lib/settings')()
    return {
      dbName,
      dbPath,
      dbFullPath: `${dbPath}/${dbName}`,
    }
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
    const qry = `select rowid, * from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)
    return stmt.get(id)
  }

  getAll() {
    const qry = `select rowid, desc from tasks`
    const stmt = this.db.prepare(qry)
    return stmt.all()
  }

  getArchived() {
    const qry = `select oldTaskId, desc from archivedTasks`
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
