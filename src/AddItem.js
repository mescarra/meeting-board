import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  Grid,
  Button,
  CircularProgress
} from '@material-ui/core';
import ReactTags from './ReactTags';

import db from './Firebase';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block'
  },
  formControl: {
    margin: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '400px'
  }
}));

const AddItem = ({ onAddition, showMessage, addingItem }) => {
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState(null);
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState('');
  const [completedError, setCompletedError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagsError, setTagsError] = useState(null);

  /* Tags fill and filter */

  const fillTagSuggestions = snap => {
    let squads = [];
    snap.forEach(x => squads.push({ ...x.data(), id: x.id }));

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
  };

  const suggestionsFilter = (item, query) => {
    return (
      item.name.startsWith(query) &&
      tags.filter(x => x.id === item.id).length === 0
    );
  };

  /* Field validations */

  const validateCompleted = newValue => {
    let newNumber = parseInt(newValue);
    let ok = false;
    if (newNumber >= 0 && newNumber <= 100) {
      setCompletedError(null);
      ok = true;
    } else {
      setCompletedError('Value must be between 0 and 100');
    }
    setCompleted(newValue);
    return ok;
  };

  const validateTags = newTags => {
    let ok = false;
    if (newTags && newTags.length > 0) {
      ok = true;
      setTagsError(null);
    } else {
      setTagsError('Select one or more tags');
    }
    setTags(newTags);
    return ok;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateCompleted(completed) && validateTags(tags)) {
      let csv = tags.map(x => x.label).toString();
      onAddition({
        name: description,
        tags: csv,
        completed: parseInt(completed)
      });
      setDescription('');
      setCompleted('');
      setTags([]);
    }
  };

  useEffect(() => {
    db.onSnapshot('squads', fillTagSuggestions, error => {
      showMessage('Error getting squads: ' + error.message, 'error');
      console.error(error);
    });
  }, []);

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
                label={tagsError ? tagsError : 'Relevant work areas'}
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
                  type: 'number'
                }}
                value={completed}
                helperText={
                  completedError
                    ? completedError
                    : 'Approximate completed percentage'
                }
                error={Boolean(completedError)}
                onChange={e => validateCompleted(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3}>
            {addingItem ? (
              <CircularProgress color="secondary" />
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Add new task
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    )
  );
};

export default AddItem;
