import React from "react";
import TagCard from "./TagCard";
import GeneralBar from "./GeneralBar";
const squadData = [
  {
    squad: "Dragon Glass",
    color: "#487ba6",
    tasks: [
      {
        name: "Enrollment Views: Focus MGMT & Hidden Content",
        tags: ["ADA Compliance"],
        completed: 100
      },
      {
        name: "Enrollment Views: Inputs",
        tags: ["ADA Compliance"],
        completed: 40
      },
      {
        name: "SI Job",
        tags: ["Pershing Integrations", "DB Locking"],
        completed: 80
      }
    ]
  },
  {
    squad: "Viridian",
    color: "#219196",
    tasks: [
      {
        name: "Managed Investments",
        tags: ["Pershing Integrations"],
        completed: 90
      },
      {
        name: "Other Task",
        tags: ["Pershing Integrations", "DB Locking"]
      }
    ]
  }
];

const tagsFromData = data => {
  const conc = xss => xss.reduce((x, y) => x.concat(y));
  let a = conc(conc(data.map(x => x.tasks.map(y => y.tags))));
  return new Map([...new Set(a)].map(x => [x, a.filter(y => y === x).length]));
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
            completed: tasks[k].completed
          });
      }
      if (newTasks.length > 0)
        newSquads.push({
          name: squad.squad,
          color: squad.color,
          tasks: newTasks
        });
    }
    newData.push({
      tag: tag,
      squads: newSquads
    });
  });

  return newData;
};

const data = squadDataToTagData(squadData);

const taskCount = tag =>
  tag.squads.map(x => x.tasks.length).reduce((a, b) => a + b, 0);

const dataSort = (x, y) => {
  if (y.squads.length === x.squads.length) {
    return taskCount(y) - taskCount(x);
  } else {
    return y.squads.length - x.squads.length;
  }
};

const GeneralBoard = ({ squads, handleGoToSquad }) => {
  return (
    <>
      <GeneralBar squads={squads} handleGoToSquad={handleGoToSquad} />
      {data.sort(dataSort).map((item, key) => (
        <TagCard key={key} tagName={item.tag} tasksPerSquad={item.squads} />
      ))}
    </>
  );
};
export default GeneralBoard;
