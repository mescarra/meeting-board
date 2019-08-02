import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormHelperText, TextField } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ReactTags from "./ReactTags";

import db from "./Firebase";

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
  const [suggestions, setSuggestions] = useState(null);

  useEffect(
    () =>
      db.getCollection("squads", squads => {
        let tags = new Set();
        squads.forEach(sq => {
          sq.tasks.forEach(tk => {
            tk.tags.forEach(tg => tags.add(tg));
          });
        });
        const newSuggestions = Array.from(tags).map(suggestion => ({
          label: suggestion,
          value: suggestion
        }));
        setSuggestions(newSuggestions);
      }),
    []
  );

  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState("");
  const [completedError, setCompletedError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState(null);

  const suggestionsFilter = (item, query) => {
    return (
      item.name.startsWith(query) &&
      tags.filter(x => x.id === item.id).length === 0
    );
  };

  const validateCompleted = newValue => {
    var newNumber = parseInt(newValue);
    if (newNumber >= 0 && newNumber <= 100) {
      setCompletedError(null);
    } else {
      setCompletedError("Value must be between 0 and 100");
    }
    setCompleted(newValue);
  };
  const validateTags = newTags => {
    if (newTags && newTags.length > 0) {
      setTagsError(null);
    } else {
      setTagsError("Select one or more tags");
    }
    setTags(newTags);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateCompleted(completed) && validateTags(tags)) {
      let csv = tags.map(x => x.label).toString();
      if (
        props.onAddition({
          name: description,
          tags: csv,
          completed: parseInt(completed)
        })
      ) {
        setDescription("");
        setCompleted("");
        setTags([]);
      }
    }
  };

  return (
    suggestions && (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} alignItems="center">
          <Grid item lg={3}>
            <FormControl className={classes.formControl}>
              <TextField
                name="Description"
                label="Description"
                required
                value={description}
                helperText="Short description for identifying your task"
                onChange={e => setDescription(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <FormControl className={classes.formControl}>
              <ReactTags
                value={tags}
                error={tagsError}
                label={tagsError ? tagsError : "Relevant work areas"}
                handleChange={validateTags}
                suggestions={suggestions}
                suggestionsFilter={suggestionsFilter}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <FormControl className={classes.formControl}>
              <TextField
                name="Completed"
                label="Completed"
                required
                InputProps={{
                  type: "number"
                }}
                value={completed}
                helperText={
                  completedError
                    ? completedError
                    : "Approximate completed percentage"
                }
                error={Boolean(completedError)}
                onChange={e => validateCompleted(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            <Button variant="contained" color="primary" type="submit">
              Add new task
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  );
};

export default AddItem;
