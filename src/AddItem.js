import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormHelperText } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ReactTags from "./ReactTags";

const useStyles = makeStyles(theme => ({
  root: {
    display: "block"
  },
  formControl: {
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "400px"
  }
}));

const AddItem = props => {
  const classes = useStyles();

  const suggestions = [
    { id: 1, label: "DB Locking", count: 3 },
    { id: 2, label: "Acceptance Tests" },
    { id: 3, label: "ADA Compliance" },
    { id: 4, label: "Pershing Integrations", count: 5 },
    { id: 5, label: "Pershing Stuff", count: 0 },
    { id: 6, label: "Blue", count: 0 }
  ].map(suggestion => ({
    ...suggestion,
    value: suggestion.label
  }));

  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState("");
  const [tags, setTags] = useState([]);

  const suggestionsFilter = (item, query) => {
    return (
      item.name.startsWith(query) &&
      tags.filter(x => x.id === item.id).length === 0
    );
  };

  const handleChange = newTags => {
    setTags(newTags);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (tags && tags.length > 0) {
          let csv = tags.map(x => x.label).toString();
          props.onAddition({
            name: description,
            tags: csv,
            completed: completed.length > 0 ? completed : 0
          });
          setDescription("");
          setCompleted("");
          setTags([]);
        }
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item lg={3}>
          <FormControl className={classes.formControl} required>
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <FormHelperText>
              Short description for identifying your task
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item lg={3}>
          <FormControl className={classes.formControl} required>
            <ReactTags
              suggestions={suggestions}
              handleChange={handleChange}
              suggestionsFilter={suggestionsFilter}
            />
            <FormHelperText>Select one or more tags</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item lg={3}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="completed">Completed</InputLabel>
            <Input
              name="completed"
              value={completed}
              type="number"
              min="0"
              max="100"
              step="1"
              onChange={e => setCompleted(e.target.value)}
            />
            <FormHelperText>Between 0 and 100</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item lg={3}>
          <Button variant="contained" color="primary" type="submit">
            Add new task
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddItem;
