import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';

const NewTaskForm = ({ addTask, lists }) => {
  const [newTask, setNewTask] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [taskDetails, setTaskDetails] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [selectedList, setSelectedList] = useState('');

  const handleNewTaskChange = (e) => {
    const taskValue = e.target.value;
    setNewTask(taskValue);
    if (taskValue.trim()) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  const handleCancel = () => {
    setShowDetails(false);
    setTaskDetails('');
    setTaskDate('');
    setSelectedList('');
    setNewTask('');
  };

  const handleSubmit = () => {
    if (newTask.trim() && taskDetails.trim() && taskDate && selectedList) {
      const task = { 
        task: newTask, 
        taskDetail: taskDetails, 
        status: false, 
        createAt: taskDate, 
        taskTagID: selectedList 
      };
      axios.post('http://localhost:8080/Newtasks', task)
        .then((response) => {
          // console.log('Task created:', response.data);
          addTask(response.data);
          handleCancel();
        })
        .catch((error) => {
          console.error('There was an error creating the task!', error);
        });
    }
  };

  return (
    <>
      <TextField
        label="New Task"
        value={newTask}
        onChange={handleNewTaskChange}
        fullWidth
        margin="normal"
      />
      {showDetails && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                label="Task Details"
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Task Date"
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="list-select-label">Select List</InputLabel>
                <Select
                  labelId="list-select-label"
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  label="Select List"
                >
                  {lists && lists.map((list, index) => (
                    <MenuItem key={index} value={list.name}>
                      {list.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginRight: '8px' }}>
            Submit
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </>
      )}
    </>
  );
};

NewTaskForm.propTypes = {
  addTask: PropTypes.func.isRequired,
  lists: PropTypes.array.isRequired,
};

NewTaskForm.defaultProps = {
  lists: [],
};

export default NewTaskForm;
