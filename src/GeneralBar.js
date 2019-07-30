import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import { Divider, Tooltip, CircularProgress } from "@material-ui/core";
import db from "./Firebase";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
));

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  category: {
    marginLeft: theme.spacing(1)
  }
}));

const GeneralBar = ({ squads, handleGoToSquad }) => {
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
      name: "New Squad",
      color: "#000000",
      location: "Nowhere, Neverland",
      tasks: []
    };
    db.addDocument("squads", newSquad, (id) => {
      setLoading(false);
      handleGoToSquad({id, ...newSquad});
    });
  }

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
          {squads.map(sq => (
            <MenuItem key={sq.id} onClick={() => handleGoToSquad(sq)}>
              {sq.name}
            </MenuItem>
          ))}
        </StyledMenu>
        <Tooltip title="Squad list">
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add new squad">
          <IconButton color="inherit" aria-label="Add new squad" onClick={handleAddNew}>
            { loading ? <CircularProgress color="secondary" size={24} /> : <AddIcon /> }
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default GeneralBar;
