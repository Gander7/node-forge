const fs = require('fs')
const chalk = require('chalk')
const Database = require('better-sqlite3')
const schema = require('./schema')

class Data {
  constructor(opts = {}) {
    const files = opts.fileSystem ? opts.fileSystem : fs
    let { dbPath, dbName, dbFullPath } = this.getPath()

    if (dbName.includes(':memory:')) {
      dbFullPath = ':memory:'
    } else {
      if (!files.existsSync(dbPath)) {
        files.mkdirSync(dbPath)
      }
    }

    this.db = opts.db ? opts.db : new Database(dbFullPath)

    this.inititialize(schema, opts.liveLogging)
  }

  getPath() {
    const { dbPath, dbName } = require('../lib/settings')()
    return {
      dbName,
      dbPath,
      dbFullPath: `${dbPath}/${dbName}`,
    }
  }

  inititialize(schema, liveLogging) {
    const qry = this.db.prepare(`select 1 from sqlite_master where type='table' and name='tasks';`)
    const stmt = qry.get()
    if (stmt === undefined) {
      if (!process.env.testing || liveLogging)
        console.log(chalk.yellow('WARNING: database appears empty; initializing it.'))
      this.db.exec(schema)
      if (!process.env.testing || liveLogging) console.log(chalk.green('database initialized.'))
    }
  }

  insert(args) {
    const qry = `
        insert into tasks (id, desc)
        values ((select max(nextid) + 1 from settings), ?);
      `
    const stmt = this.db.prepare(qry)

    const settingsQry = `update settings set nextid = nextid + 1`
    const settingsStmt = this.db.prepare(settingsQry)

    let retVal
    this.db.transaction(() => {
      retVal = stmt.run(args.desc)
      const task = this.getOne(retVal.lastInsertRowid)
      args.tags.forEach((tagName) => this.addTag(task.id, tagName))
      if (args.project) this.addProject(task.id, args.project)
      settingsStmt.run()
    })()

    return retVal
  }

  addTag(id, tag) {
    const tagsQry = `
      insert into taskTags (taskId, tag) 
      select ?, ? 
      where not exists (select 1 from taskTags where taskId = ? and tag = ?)`
    return this.db.prepare(tagsQry).run(id, tag, id, tag)
  }

  addProject(id, project) {
    const qry = `
      insert into projects (taskId, project) 
      select ?, ? 
      where not exists (select 1 from projects where taskId = ? and project = ?)`
    return this.db.prepare(qry).run(id, project, id, project)
  }

  updateTask(task) {
    const qry = `update tasks set desc = ? where rowid = ?`
    const stmt = this.db.prepare(qry)
    stmt.run(task.desc, task.id)

    let retVal
    this.db.transaction(() => {
      retVal = stmt.run(task.desc, task.id)
      if (task.tagsToRemove)
        task.tagsToRemove.forEach((tagName) => this.removeTag(task.id, tagName))
      if (task.tags) task.tags.forEach((tagName) => this.addTag(task.id, tagName))
      if (task.projectToRemove !== '') this.removeProject(task.id, task.projectToRemove)
      if (task.project !== '') {
        this.addProject(task.id, task.project)
      }
    })()

    return retVal
  }

  getOne(id) {
    const qry = `select rowid, * from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)
    const task = stmt.get(id)
    if (task) {
      task.tags = this.getTags(task.id)
      task.project = this.getProject(task.id)
    }
    return task
  }

  getTasksByTag(tagName) {
    const qry = `select rowid, * from tasks where id in (select taskId from taskTags where tag = ?)`
    const stmt = this.db.prepare(qry)
    const res = stmt.all(tagName)
    return res
  }

  getTags(taskId) {
    const qry = `select rowid, * from taskTags where taskId = ?`
    const stmt = this.db.prepare(qry)
    return stmt.all(taskId)
  }

  getProject(taskId) {
    const qry = `select project from projects where taskId = ?`
    const res = this.db.prepare(qry).get(taskId)
    return res ? res.project : ''
  }

  getTagList() {
    const qry = `
      select distinct tag, count(*) 
      from taskTags where taskId in (select distinct taskId from tasks) 
      group by tag`
    return this.db.prepare(qry).all()
  }

  getProjectList() {
    const projectQry = `select distinct project from projects`
    const projects = this.db.prepare(projectQry).all()

    const todoQry = `
      select distinct project, count(*) as count
      from projects where taskId in (select distinct taskId from tasks)
        and taskId not in (select distinct oldTaskId from archivedTasks)
      group by project
    `
    const todo = this.db.prepare(todoQry).all()

    const doneQry = `
      select distinct project, count(*) as count
      from projects where taskId in (select distinct oldTaskId from archivedTasks)
      group by project
    `
    const done = this.db.prepare(doneQry).all()

    const res = projects.map((prj) => {
      const doneCount = done.find((task) => task.project === prj.project)
      prj.done = doneCount ? doneCount.count : 0
      const todoCount = todo.find((task) => task.project === prj.project)
      prj.todo = todoCount ? todoCount.count : 0
      prj.total = prj.done + prj.todo
      prj.vs = `${prj.done}/${prj.total}`
      prj.percentage = Math.floor((prj.done / prj.total) * 100)
      return prj
    })

    return res.sort((a, b) => (a.percentage > b.percentage ? 1 : -1))
  }
  getTasksByProject(projectName) {
    const qry = `select rowid, * from tasks where id in (select taskId from projects where project = ?)`
    return this.db.prepare(qry).all(projectName)
  }

  getAll() {
    const qry = `select rowid, desc from tasks`
    const stmt = this.db.prepare(qry)
    return stmt.all()
  }

  getArchived() {
    const qry = `select oldTaskId, desc, archivedOn from archivedTasks`
    const stmt = this.db.prepare(qry)
    return stmt.all()
  }

  removeTask(id, opts = { deleteTags: true }) {
    const task = this.getOne(id)
    if (!task) return { error: 'task not found' }

    const qry = `delete from tasks where rowid = ?`
    const stmt = this.db.prepare(qry)

    let retVal
    this.db.transaction(() => {
      retVal = stmt.run(task.rowid)
      if (opts.deleteTags) task.tags.forEach((tagName) => this.removeTag(task.id, tagName))
    })()

    return retVal
  }

  removeTag(id, tagName) {
    const qry = `delete from taskTags where taskId = ? and tag = ?`
    const stmt = this.db.prepare(qry)
    return stmt.run(id, tagName)
  }

  removeProject(id, project) {
    const qry = `delete from projects where taskId = ? and project = ?`
    const stmt = this.db.prepare(qry)
    return stmt.run(id, project)
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
      this.removeTask(id, { deleteTags: false })
    })
    run()

    return task ? task.id : undefined
  }

  restore(id) {
    const qry = `
      insert into tasks (id, desc)
      select oldTaskId, desc
      from archivedTasks where oldTaskId = ?
    `
    const stmt = this.db.prepare(qry)

    const removeQry = `delete from archivedTasks where oldTaskId = ?`
    const removeStmt = this.db.prepare(removeQry)

    let retVal
    this.db.transaction(() => {
      retVal = stmt.run(id)
      removeStmt.run(id)
    })()

    return retVal
  }
}

module.exports = Data
