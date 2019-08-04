const tagsFromData = data => {
  const conc = xss => (xss.length > 0 ? xss.reduce((x, y) => x.concat(y)) : []);
  let a = conc(conc(data.map(x => x.tasks.map(y => y.tags))));
  return new Map([...new Set(a)].map(x => [x, a.filter(y => y === x).length]));
};

const taskCount = tag =>
  tag.squads.map(x => x.tasks.length).reduce((a, b) => a + b, 0);

const dataSort = (x, y) => {
  if (y.squads.length === x.squads.length) {
    return taskCount(y) - taskCount(x);
  } else {
    return y.squads.length - x.squads.length;
  }
};

const squadDataToTagData = data => {
  let tags = tagsFromData(data);
  let newData = [];

  tags.forEach((_, tag) => {
    let newSquads = [];
    for (let j = 0; j < data.length; j++) {
      let squad = data[j];
      let tasks = squad.tasks;
      let newTasks = [];
      for (let k = 0; k < tasks.length; k++) {
        if (tasks[k].tags.includes(tag))
          newTasks.push({
            name: tasks[k].name,
            completed: parseInt(tasks[k].completed)
          });
      }
      if (newTasks.length > 0)
        newSquads.push({
          name: squad.name,
          color: squad.color,
          tasks: newTasks
        });
    }
    newData.push({
      tag: tag,
      squads: newSquads
    });
  });

  return newData.sort(dataSort);
};

export default squadDataToTagData;
