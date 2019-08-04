import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  LinearProgress
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    paddingBottom: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(0)
  },
  progressBar: {
    minWidth: 50,
    marginLeft: 20
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
      <ListItem dense button onClick={handleClick}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText
          primary={props.title}
          secondary={props.subtitle}
          primaryTypographyProps={{
            variant: 'h6',
            component: 'h3',
            style: { color: props.bgColor }
          }}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      {props.tasks.map((task, key) => (
        <Collapse key={key} in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              onClick={() => console.log('do something')}
              className={classes.nested}
            >
              <ListItemText
                secondary={task.name}
                secondaryTypographyProps={{ color: 'textPrimary' }}
              />
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
