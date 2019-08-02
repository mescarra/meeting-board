import React, { useState, useEffect } from "react";
import TagCard from "./TagCard";
import GeneralBar from "./GeneralBar";
import db from "./Firebase";

import LoadingPage from "./LoadingPage";
import TempMessage from "./TempMessage";

const tagsFromData = data => {
  const conc = xss => (xss.length > 0 ? xss.reduce((x, y) => x.concat(y)) : []);
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

  return newData;
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

const GeneralBoard = () => {
  const [squads, setSquads] = useState(null);
  const [tagData, setTagData] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  let timerId = null;

  const handleGet = newSquads => {
    setSquads(newSquads);
    console.log(newSquads);
    const tags = squadDataToTagData(newSquads);
    setTagData(tags);
  };

  const timeout = () => {
    setActiveMessage("Error getting squads: Request timed out...");
  };

  useEffect(() => {
    timerId = setTimeout(timeout, 20000);

    const onMount = async () => {
      const snap = await db.getCollection("squads");
      clearTimeout(timerId);
      let data = [];
      snap.forEach(x => data.push({ ...x.data(), id: x.id }));
      handleGet(data);
      // .catch(error => {
      //   setActiveMessage(
      //     "Error getting squads. Please, try reloading the page..."
      //   );
      //   console.error("Error getting squads", error);
      // });
      document.title = "General board";
    };

    onMount();
  }, []);

  return (
    <>
      <TempMessage
        open={Boolean(activeMessage)}
        handleClose={() => setActiveMessage(null)}
        variant="error"
        message={activeMessage}
      />
      {squads ? (
        <>
          <GeneralBar squads={squads} />
          {tagData.sort(dataSort).map((item, key) => (
            <TagCard key={key} tagName={item.tag} tasksPerSquad={item.squads} />
          ))}
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};
export default GeneralBoard;
