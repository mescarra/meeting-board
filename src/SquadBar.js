import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import ColorIcon from "@material-ui/icons/ColorLens";
import TextField from "@material-ui/core/TextField";
import { ChromePicker } from "react-color";
import Popover from "@material-ui/core/Popover";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Link as RouterLink, withRouter } from "react-router-dom";

import db from "./Firebase";
import { Tooltip, CircularProgress, Grid } from "@material-ui/core";

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
    width: "fit-content",
    margin: theme.spacing(2)
  }
}));

const SquadBar = withRouter(({ squad, history }) => {
  const [readOnly, setReadOnly] = useState(true);
  const [name, setName] = useState(squad.name);
  const [color, setColor] = useState(squad.color);
  const [location, setLocation] = useState(squad.location);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const inputProps = {
    disableUnderline: true,
    readOnly: readOnly
  };

  const handleColorChange = newColor => {
    if (newColor && !readOnly) {
      setColor(newColor.hex);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  function handleOpenPopover(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClosePopover() {
    setAnchorEl(null);
  }

  const handleUpdate = () => {
    if (!readOnly)
      db.editDocument("squads", squad.id, { name, color, location });

    setReadOnly(!readOnly);
  };

  const handleDelete = () => {
    setLoading(true);
    db.deleteDocument("squads", squad.id, () => {
      setDeleteDialogOpen(false);
      setLoading(false);
      history.push("/");
    });
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        className={classes.marginBottom}
        style={{ backgroundColor: color }}
      >
        <Toolbar>
          <IconButton
            component={RouterLink}
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
              style: { color: "inherit", fontSize: "1.2em" }
            }}
          />
          <span className={classes.title} />

          <TextField
            value={location}
            onChange={e => setLocation(e.target.value)}
            InputProps={{
              ...inputProps,
              style: { color: "inherit", fontSize: "0.8em" }
            }}
            inputProps={{ style: { textAlign: "right" } }}
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
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            <ChromePicker color={color} onChange={handleColorChange} />
          </Popover>
          <Tooltip title={readOnly ? "Edit squad" : "Verify changes"}>
            <IconButton
              onClick={handleUpdate}
              color="inherit"
              aria-label="edit squad"
              className={classes.marginLeft}
            >
              {readOnly ? <EditIcon /> : <CheckIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete squad">
            <IconButton
              onClick={() => setDeleteDialogOpen(true)}
              color="inherit"
              aria-label="delete squad"
              className={classes.marginLeft}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you really want to delete this squad?"}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress color="secondary" />
          ) : (
            <DialogContentText id="alert-dialog-description">
              Deleting this squad will remove related tasks and properties from
              the database. Are you sure you want to continue?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="secondary"
            autoFocus
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default SquadBar;
