import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  Divider,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { Link as RouterLink, withRouter } from 'react-router-dom';

import db from './Firebase';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
));

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  },
  category: {
    marginLeft: theme.spacing(1)
  }
}));

const GeneralBar = ({ squads, showMessage, history }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddNew = () => {
    setLoading(true);
    const newSquad = {
      name: 'New Squad',
      color: '#000000',
      location: 'Nowhere, Neverland',
      tasks: []
    };
    db.addDocument('squads', newSquad)
      .then(docRef => {
        setLoading(false);
        history.push('/squads/' + docRef.id);
      })
      .catch(error => {
        setLoading(false);
        showMessage('Error adding squad: ' + error.message);
      });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          General
        </Typography>

        <StyledMenu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <Typography variant="overline" className={classes.category}>
            Squads
          </Typography>
          <Divider />
          <List>
            {squads.map(sq => (
              <ListItem
                key={sq.id}
                button
                component={RouterLink}
                to={'/squads/' + sq.id}
              >
                <ListItemText>{sq.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </StyledMenu>
        <Tooltip title="Squad list">
          <IconButton color="inherit" aria-label="Menu" onClick={handleClick}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add new squad">
          <IconButton
            color="inherit"
            aria-label="Add new squad"
            onClick={handleAddNew}
          >
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              <AddIcon />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(GeneralBar);
