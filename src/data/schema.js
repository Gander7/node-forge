const schema = `
  create table settings (
    nextid integer
  );

  create table tasks (
    id integer,
    desc text
  );

  create table archivedTasks (
    desc text,
    archivedOn text,
    oldTaskId integer
  );

  create table projects (
    taskId integer,
    name text
  );

  create table timelog (
    taskId integer,
    startTime text,
    endTime text
  );

  insert into settings (nextid) values (0)
`

module.exports = schema
