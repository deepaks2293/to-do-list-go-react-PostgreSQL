import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon, Label } from 'semantic-ui-react';

const TaskList = ({ tasks, onTaskToggle, onTaskUndo, onTaskDelete }) => {
  return (
    <div>
      <Card.Group>
        {tasks.map((task, index) => (
          <Card
            key={index}
            fluid
            style={{
              backgroundColor: task.status ? 'lightgreen' : 'white'
            }}
          >
            <Card.Content>
              <Card.Header
                as='h6'
                style={{
                  textDecoration: task.status ? 'line-through' : 'none',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                  fontWeight: 'bold',
                  fontSize: '1.25em'
                }}
              >
                {task.task}
              </Card.Header>
              <Card.Description
                style={{
                  textDecoration: task.status ? 'line-through' : 'none',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                  fontSize: '0.875em',
                  color: 'rgba(0, 0, 0, 0.6)'
                }}
              >
                {task.taskDetail}
              </Card.Description>
              <Card.Meta textAlign="right">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: 10 }}>
                    <Button icon labelPosition='left' onClick={() => onTaskToggle(index)}>
                      <Icon name='check circle' color="green" />
                      Done
                    </Button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: 10 }}>
                    <Button icon labelPosition='left' onClick={() => onTaskUndo(index)}>
                      <Icon name="undo" color="yellow" />
                      Undo
                    </Button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: 10 }}>
                    <Button icon labelPosition='left' onClick={() => onTaskDelete(task.id)}>
                      <Icon name="delete" color="red" />
                      Delete
                    </Button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: 10 }}>
                    <Label as='a' color='pink' tag >
                      {task.taskTagId}
                    </Label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: 10 }}>
                    <Label as='a'>
                      <Icon name='calendar' /> {task.createAt}
                    </Label>
                  </div>
                </div>
              </Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      task: PropTypes.string.isRequired,
      taskDetail: PropTypes.string.isRequired,
      createAt: PropTypes.string.isRequired,
      taskTagId: PropTypes.string.isRequired,
      status: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onTaskToggle: PropTypes.func.isRequired,
  onTaskUndo: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
};

export default TaskList;
