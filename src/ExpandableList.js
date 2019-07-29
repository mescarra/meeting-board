import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SendIcon from "@material-ui/icons/Send";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    paddingBottom: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(0)
  },
  progressBar: {
    minWidth: "50px",
    marginLeft: "10px"
  }
}));

const ExpandableList = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  function handleClick() {
    setOpen(!open);
  }

  return (
    <List className={classes.root}>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText
          primary={props.rootName}
          style={{ color: props.bgColor }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      {props.tasks.map((task, key) => (
        <Collapse key={key} in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              onClick={() => console.log("do something")}
              className={classes.nested}
            >
              <ListItemText secondary={task.name} />
              {task.completed ? (
                <LinearProgress
                  className={classes.progressBar}
                  variant="determinate"
                  value={task.completed}
                />
              ) : null}
            </ListItem>
          </List>
        </Collapse>
      ))}
    </List>
  );
};

export default ExpandableList;
