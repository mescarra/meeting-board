import React, { useState } from "react";
import GeneralBoard from "./GeneralBoard";
import SquadBoard from "./SquadBoard";
import db from "./Firebase";

const App = props => {
  const [squad, setSquad] = useState(null);
  const [squads, setSquads] = useState(null);

  db.getCollection("squads", setSquads)

  return (
    <>
      {squads &&
        (squad ? (
          <SquadBoard squad={squad} handleCloseSquad={() => setSquad(null)} />
        ) : (
          <GeneralBoard squads={squads} handleGoToSquad={setSquad} />
        ))}
    </>
  );
};

export default App;
