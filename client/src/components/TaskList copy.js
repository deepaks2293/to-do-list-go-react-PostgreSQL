import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Button, Checkbox, FormControlLabel, Box, Typography } from '@mui/material';
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";

const TaskList = ({ tasks , onTaskToggle}) => {
  const handleCheckboxClick = (index) => {
    onTaskToggle(index); // Call the onTaskToggle function passed from the parent component
  };
  
  return (
    <List>
      {tasks.map((task, index) => (
        <ListItem 
          key={index} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px 0', 
            textDecoration: task.status ? 'line-through' : 'none' // Apply text decoration based on task status
          }}
        >
           <FormControlLabel
            control={<Checkbox checked={task.status} onClick={() => handleCheckboxClick(index)} />} /* Pass the index to handleCheckboxClick */
            label=""
            style={{ marginRight: 16 }}
          />
          <Box 
            display="flex"  
            alignItems="center" 
            justifyContent="space-between" 
            flexGrow={1} 
            sx={{ border: '2px grey', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}
          >
            <Box sx={{ flexGrow: 1, maxWidth: '70%' }}>
              <Typography variant="h6">{task.task}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ wordWrap: 'break-word' }}>
                {task.taskDetail}
              </Typography>
            </Box>
            <Box>
              <Button variant="outlined" color="primary" size="small" style={{ marginLeft: 16 }}>
                {task.createAt}
              </Button>
              <Button variant="outlined" color="secondary" size="small" style={{ marginLeft: 8 }}>
                {task.taskTagId}
              </Button>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      task: PropTypes.string.isRequired,
      taskDetail: PropTypes.string.isRequired,
      createAt: PropTypes.string.isRequired,
      taskTagId: PropTypes.string.isRequired,
      status: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default TaskList;
