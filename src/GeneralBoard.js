import React, { useState, useEffect } from 'react';
import TagCard from './TagCard';
import GeneralBar from './GeneralBar';
import db from './Firebase';

import LoadingPage from './LoadingPage';
import TempMessage from './TempMessage';
import squadDataToTagData from './dataTransform';

const GeneralBoard = () => {
  const LOADING_TIME_LIMIT = 20000;

  const [squads, setSquads] = useState(null);
  const [tagData, setTagData] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  let timerId = null;

  const handleGet = newSquads => {
    setSquads(newSquads);
    const tags = squadDataToTagData(newSquads);
    setTagData(tags);
  };

  const timeout = () => {
    setActiveMessage('Error getting squads: Request timed out...');
  };

  useEffect(() => {
    timerId = setTimeout(timeout, LOADING_TIME_LIMIT);

    const onMount = async () => {
      try {
        const snap = await db.getCollection('squads');
        clearTimeout(timerId);
        let data = [];
        snap.forEach(x => data.push({ ...x.data(), id: x.id }));
        handleGet(data);
      } catch (error) {
        setActiveMessage('Error getting squads:', error.message);
        console.error('Error getting squads', error);
      }

      document.title = 'General board';
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
          <GeneralBar squads={squads} setActiveMessage={setActiveMessage} />
          {tagData.map((item, key) => (
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
