import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandableList from "./ExpandableList";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  card: {
    width: 275,
    display: "inline-block",
    margin: "20px"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const TagCard = ({ tagName, tasksPerSquad }) => {
  const classes = useStyles();
  const [collab, setCollab] = useState(false);
  const squadCount = tasksPerSquad.length;
  const taskCount = tasksPerSquad
    .map(x => x.tasks.length)
    .reduce((a, b) => a + b, 0);

  return (
    <Card
      className={classes.card}
      style={
        collab ? { backgroundColor: "#eee" } : { backgroundColor: "white" }
      }
    >
      <CardContent>
        <Typography variant="h5" component="h2">
          {tagName}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {taskCount} Tasks | {squadCount} Squads
        </Typography>
        {tasksPerSquad.map((squad, key) => (
          <ExpandableList
            key={key}
            rootName={squad.name}
            bgColor={squad.color}
            tasks={squad.tasks}
          />
        ))}
      </CardContent>
      <CardActions>
        <Button onClick={() => setCollab(!collab)} size="small">
          {collab ? "Unmark" : "Mark as collaborated"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TagCard;
