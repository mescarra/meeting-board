import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent } from '@material-ui/core';

import db from './Firebase';
import SquadBar from './SquadBar';
import AddItem from './AddItem';
import TempMessage from './TempMessage';
import LoadingPage from './LoadingPage';
import TaskTable from './TaskTable';

const SquadBoard = props => {
  const LOADING_TIME_LIMIT = 20000;
  const id = props.match.params.id;

  const [squad, setSquad] = useState(null);
  const [activeMessage, setActiveMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [addingItem, setAddingItem] = useState(false);

  let timerId = null;

  const columns = [
    { title: 'Task', field: 'name' },
    { title: 'Tags', field: 'tags' },
    { title: 'Completed', field: 'completed', type: 'numeric' }
  ];

  /* Auxiliary functions */

  const timeout = () => {
    setMessageType('error');
    setActiveMessage('Error getting squad: Request timed out...');
  };

  const showMessage = (msg, type) => {
    setMessageType(type);
    setActiveMessage(msg);
  };

  /* Table functionality */

  const taskToRow = task => {
    return { ...task, tags: task.tags.toString(',') };
  };

  const rowToTask = row => {
    return { ...row, tags: row.tags.split(',') };
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

  const addRow = async row => {
    if (squad.tasks.filter(x => x.name === row.name).length === 0) {
      setAddingItem(true);
      try {
        const newSquad = { ...squad, tasks: [...squad.tasks, rowToTask(row)] };
        await db.editDocument('squads', id, newSquad);
        showMessage('Successfully added task!', 'success');
        setSquad(newSquad);
      } catch (error) {
        showMessage('Error adding task: ' + error.message, 'error');
      }
    }
    setAddingItem(false);
  };

  const onRowUpdate = (newData, oldData) => {
    const newSquad = updateRow(oldData, newData);
    return db
      .editDocument('squads', id, newSquad)
      .then(() => {
        showMessage('Task successfully edited!', 'success');
        setSquad(newSquad);
      })
      .catch(() => {
        showMessage('Error editing task', 'error');
      });
  };

  const onRowDelete = oldData => {
    const newSquad = updateRow(oldData);
    return db
      .editDocument('squads', id, newSquad)
      .then(() => {
        showMessage('Task successfully deleted!', 'success');
        setSquad(newSquad);
      })
      .catch(() => {
        showMessage('Error deleting task', 'error');
      });
  };

  useEffect(() => {
    timerId = setTimeout(timeout, LOADING_TIME_LIMIT);
    const onMount = async () => {
      try {
        const doc = await db.getDocument('squads', id);
        const newSquad = doc.data();
        clearTimeout(timerId);
        setSquad(newSquad);
        document.title = 'Squad ' + newSquad.name;
      } catch (error) {
        showMessage('Error getting squad: ' + error.message, 'error');
        console.error('Error getting squad', error);
      }
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
          <Card style={{ overflow: 'visible' }}>
            <CardContent>
              <Typography variant="h6">Add task</Typography>
              <AddItem
                onAddition={addRow}
                showMessage={showMessage}
                addingItem={addingItem}
              />
            </CardContent>
          </Card>
          <br />
          <TaskTable
            columns={columns}
            data={squad.tasks.map(taskToRow)}
            onRowUpdate={onRowUpdate}
            onRowDelete={onRowDelete}
          />
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default SquadBoard;
