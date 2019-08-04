import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  CircularProgress,
  IconButton,
  Popover,
  TextField,
  Toolbar,
  Tooltip
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import ColorIcon from '@material-ui/icons/ColorLens';

import { ChromePicker } from 'react-color';
import { Link as RouterLink, withRouter } from 'react-router-dom';

import db from './Firebase';
import DeleteDialog from './DeleteDialog';

const AdapterLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  marginRight: {
    marginRight: theme.spacing(2)
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  card: {
    width: 'fit-content',
    margin: theme.spacing(2)
  }
}));

const SquadBar = ({ id, squad, showMessage, history }) => {
  const classes = useStyles();

  const [name, setName] = useState(squad.name);
  const [color, setColor] = useState(squad.color);
  const [location, setLocation] = useState(squad.location);
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const popoverId = open ? 'simple-popover' : undefined;

  const inputProps = {
    disableUnderline: true,
    readOnly: readOnly
  };

  const handleColorChange = newColor => {
    if (newColor && !readOnly) {
      setColor(newColor.hex);
    }
  };

  const handleOpenPopover = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const restoreNormality = () => {
    setLoading(false);
    setReadOnly(true);
    setDeleteDialogOpen(false);
  };

  const handleUpdate = () => {
    if (!readOnly) {
      setLoading(true);
      db.editDocument('squads', id, { name, color, location })
        .then(() => {
          showMessage('Squad successfully updated!', 'success');
          document.title = 'Squad ' + name;
          restoreNormality();
        })
        .catch(error => {
          showMessage('Error updating squad', 'error');
          console.error('Error updating squad: ', error);
          restoreNormality();
        });
    } else {
      setReadOnly(false);
    }
  };

  const handleDelete = () => {
    setLoading(true);
    db.deleteDocument('squads', id)
      .then(() => {
        restoreNormality();
        history.push('/');
      })
      .catch(error => {
        showMessage('Error deleting squad', 'error');
        console.error('Error deleting squad: ', error);
        restoreNormality();
      });
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        className={classes.marginBottom}
        style={{ backgroundColor: color }}
      >
        <Toolbar>
          <IconButton
            component={AdapterLink}
            to="/"
            edge="start"
            className={classes.marginRight}
            color="inherit"
            aria-label="back to general"
          >
            <MenuIcon />
          </IconButton>
          <TextField
            value={name}
            onChange={e => setName(e.target.value)}
            InputProps={{
              ...inputProps,
              style: { color: 'inherit', fontSize: '1.2em' }
            }}
          />
          <span className={classes.title} />

          <TextField
            value={location}
            onChange={e => setLocation(e.target.value)}
            InputProps={{
              ...inputProps,
              style: { color: 'inherit', fontSize: '0.8em' }
            }}
            inputProps={{ style: { textAlign: 'right' } }}
          />
          {readOnly ? null : (
            <IconButton
              onClick={handleOpenPopover}
              color="inherit"
              aria-label="edit color"
              className={classes.marginLeft}
            >
              <ColorIcon />
            </IconButton>
          )}
          <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <ChromePicker color={color} onChange={handleColorChange} />
          </Popover>
          <Tooltip title={readOnly ? 'Edit squad' : 'Verify changes'}>
            <IconButton
              onClick={handleUpdate}
              color="inherit"
              aria-label="edit squad"
              className={readOnly ? classes.marginLeft : null}
            >
              {readOnly ? (
                <EditIcon />
              ) : loading ? (
                <CircularProgress color="secondary" size={24} />
              ) : (
                <CheckIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete squad">
            <IconButton
              onClick={() => setDeleteDialogOpen(true)}
              color="inherit"
              aria-label="delete squad"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <DeleteDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        handleDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default withRouter(SquadBar);
