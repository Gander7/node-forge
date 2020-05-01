function add(args) {
  const newTask = {
    desc: args.join(' '),
  }
  return newTask
}

module.exports = add
