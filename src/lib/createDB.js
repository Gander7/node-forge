exports.createDB = (db) => {
  const sqlInit = `
      create table tasks (
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
  db.exec(sqlInit)
}
