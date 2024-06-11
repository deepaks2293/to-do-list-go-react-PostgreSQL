import React, { useState } from 'react';
import { ListItem, ListItemText, TextField, Button, Checkbox, List } from '@mui/material';

const TaskItem = ({ task, addSubtask }) => {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(newSubtask);
      setNewSubtask('');
    }
  };

  return (
    <ListItem className="list-item">
      <Checkbox />
      <ListItemText primary={task.title} />
      <TextField
        label="New Subtask"
        value={newSubtask}
        onChange={(e) => setNewSubtask(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="secondary" onClick={handleAddSubtask}>
        Add Subtask
      </Button>
      <List>
        {task.subtasks.map((subtask, subIndex) => (
          <ListItem key={subIndex}>
            <Checkbox />
            <ListItemText primary={subtask} />
          </ListItem>
        ))}
      </List>
    </ListItem>
  );
};

export default TaskItem;
