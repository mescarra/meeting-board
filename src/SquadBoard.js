import React, { forwardRef, useState, useEffect } from "react";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Typography from "@material-ui/core/Typography";
import { Card, CardContent } from "@material-ui/core";

import db from "./Firebase";
import SquadBar from "./SquadBar";
import AddItem from "./AddItem";
import TempMessage from "./TempMessage";
import LoadingPage from "./LoadingPage";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const SquadBoard = props => {
  const [squad, setSquad] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const id = props.match.params.id;
  let timerId = null;

  const columns = [
    { title: "Task", field: "name" },
    { title: "Tags", field: "tags" },
    { title: "Completed", field: "completed", type: "numeric" }
  ];

  const timeout = () => {
    setMessageType("error");
    setActiveMessage("Error getting squad: Request timed out...");
  };

  const taskToRow = task => {
    return { ...task, tags: task.tags.toString(",") };
  };

  const rowToTask = row => {
    return { ...row, tags: row.tags.split(",") };
  };

  const updateRow = (oldRow, newRow) => {
    const tasks = squad.tasks;
    const index = tasks.findIndex(x => x.name === oldRow.name);

    if (newRow) {
      const newTask = rowToTask(newRow);
      tasks[index] = newTask;
    } else {
      tasks.splice(index, 1);
    }

    return { ...squad, tasks: tasks };
  };

  const addRow = row => {
    if (squad.tasks.filter(x => x.name === row.name).length === 0) {
      const newSquad = { ...squad, tasks: [...squad.tasks, rowToTask(row)] };
      db.editDocument("squads", id, newSquad);
      setSquad(newSquad);
      return true;
    }
    return false;
  };

  const showMessage = (msg, type) => {
    setMessageType(type);
    setActiveMessage(msg);
  };

  useEffect(() => {
    timerId = setTimeout(timeout, 20000);
    const onMount = async () => {
      const doc = await db.getDocument("squads", id);
      const newSquad = doc.data();
      clearTimeout(timerId);
      setSquad(newSquad);

      // .catch(error => {
      //   setMessageType("error");
      //   setActiveMessage(
      //     "Error getting squad. Please, try reloading the page..."
      //   );
      //   console.error("Error getting squad", error);
      // });

      document.title = "Squad " + newSquad.name;
    };
    onMount();
  }, []);

  return (
    <>
      <TempMessage
        open={Boolean(activeMessage)}
        handleClose={() => setActiveMessage(null)}
        variant={messageType}
        message={activeMessage}
      />
      {squad ? (
        <>
          <SquadBar id={id} squad={squad} showMessage={showMessage} />
          <Card style={{ overflow: "visible" }}>
            <CardContent>
              <Typography variant="h6">Add task</Typography>
              <AddItem onAddition={addRow} />
            </CardContent>
          </Card>
          <br />
          <MaterialTable
            options={{
              headerStyle: {
                zIndex: 0
              }
            }}
            icons={tableIcons}
            title="Current Tasks"
            columns={columns}
            data={squad.tasks.map(taskToRow)}
            editable={{
              onRowUpdate: (newData, oldData) => {
                const newSquad = updateRow(oldData, newData);
                return db
                  .editDocument("squads", id, newSquad)
                  .then(() => {
                    showMessage("Task successfully edited!", "success");
                    setSquad(newSquad);
                  })
                  .catch(() => {
                    showMessage("Error editing task", "error");
                  });
              },
              onRowDelete: oldData => {
                const newSquad = updateRow(oldData);
                return db
                  .editDocument("squads", id, newSquad)
                  .then(() => {
                    showMessage("Task successfully deleted!", "success");
                    setSquad(newSquad);
                  })
                  .catch(() => {
                    showMessage("Error deleting task", "error");
                  });
              }
            }}
          />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default SquadBoard;
