import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import ColorIcon from "@material-ui/icons/ColorLens";
import TextField from "@material-ui/core/TextField";
import { ChromePicker } from "react-color";
import Popover from "@material-ui/core/Popover";

export default function SquadBoard({ squad, handleCloseSquad }) {
  const [readOnly, setReadOnly] = useState(true);
  const [name, setName] = useState(squad.name);
  const [color, setColor] = useState(squad.color);
  const [location, setLocation] = useState(squad.location);

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
    topbar: {
      backgroundColor: color,
      marginBottom: theme.spacing(2)
    },
    marginBottom: {
      marginBottom: theme.spacing(2)
    },
    card: {
      width: "fit-content",
      margin: theme.spacing(2)
    }
  }));
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
            edge="start"
            className={classes.marginRight}
            color="inherit"
            aria-label="back to general"
            onClick={handleCloseSquad}
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
          <IconButton
            onClick={() => setReadOnly(!readOnly)}
            color="inherit"
            aria-label="edit squad"
            className={classes.marginLeft}
          >
            {readOnly ? <EditIcon /> : <CheckIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
