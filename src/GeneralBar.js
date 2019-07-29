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
import { Divider, Tooltip } from "@material-ui/core";

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
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
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
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Tooltip title="Squad list">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>
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
        <Tooltip title="Add new squad">
          <IconButton color="inherit" aria-label="Add new squad">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default GeneralBar;
