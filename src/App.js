import React, { useState } from "react";
import GeneralBoard from "./GeneralBoard";
import SquadBoard from "./SquadBoard";
import { DB_CONFIG } from "./config";
import firebase from "firebase";

const App = props => {
  const [squad, setSquad] = useState(null);
  const [squads, setSquads] = useState([]);

  console.log("h");
  if (!firebase.apps.length) firebase.initializeApp(DB_CONFIG);

  const db = firebase.firestore();

  let x = db.collection("tags").get();
  console.log(x);

  x.then(snap => {
    console.log(snap);
    let newSquads = [];
    snap.forEach(x => newSquads.push({ ...x.data(), id: x.id }));
    setSquads(newSquads);
  }).catch(e => console.log(e));

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
