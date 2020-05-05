const schema = `
  create table tasks (
    id integer,
    desc text
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
`

module.exports = schema
