import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import './Sidebar.css';

let endpoint = "http://localhost:8080";

const Sidebar = ({ onListsUpdate, onListClick }) => {
  const [categories, setCategories] = useState([
    { name: 'Today', count: 0 },
    { name: 'Tomorrow', count: 0 },
    { name: 'After tomorrow', count: 0 },
    { name: 'Past', count: 0 },
    { name: 'All', count: 0 }
  ]);
  const [lists, setLists] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    // Fetch category counts from the backend using Axios
    axios.get(endpoint + '/tagsbydate')
      .then(response => {
        const newCategories = [
          { name: 'Today', count: response.data.today_count },
          { name: 'Tomorrow', count: response.data.tomorrow_count },
          { name: 'After tomorrow', count: response.data.after_tomorrow_count },
          { name: 'Past', count: response.data.past_count },
          { name: 'All', count: response.data.all_count }
        ];
        setCategories(newCategories);
      })
      .catch(error => {
        console.error('Error fetching category counts:', error);
        // If there's an error, reset categories to default counts
        setCategories([
          { name: 'Today', count: 0 },
          { name: 'Tomorrow', count: 0 },
          { name: 'After tomorrow', count: 0 },
          { name: 'Past', count: 0 },
          { name: 'All', count: 0 }
        ]);
      });

    // Fetch lists from the backend using Axios
    axios.get(endpoint + '/tags-count')
      .then(response => {
        setLists(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching tags count:', error);
        setLists([]);
      });
  }, []);

  const handleCreateList = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleNewListNameChange = (event) => {
    setNewListName(event.target.value);
  };

  const handleCreateNewList = () => {
    if (newListName.trim() !== '') {
      const newList = { name: newListName, count: 0 };
      axios.post(endpoint + '/tasktags', newList)
        .then(response => {
          setLists([...lists, newList]);
        })
        .catch(error => {
          console.error('Error creating new list:', error);
        });
    }
    setIsPopupOpen(false);
  };

  useEffect(() => {
    onListsUpdate(lists);
  }, [lists, onListsUpdate]);

  return (
    <div className="sidebar">
      <List>
        {categories.map((category, index) => (
          <ListItem button key={index} onClick={() => onListClick(category.name)}>
            <ListItemText primary={category.name} />
            <span>{category.count}</span>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {lists.map((list, index) => (
          <ListItem button key={index} onClick={() => onListClick(list.name)}>
            <ListItemText primary={list.name} />
            <span>{list.count}</span>
          </ListItem>
        ))}
      </List>
      <Divider style={{ marginTop: '45vh' }} />
      <div className="create-list">
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateList}>
          Create new list
        </Button>
      </div>
      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Create New List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newListName"
            label="List Name"
            fullWidth
            value={newListName}
            onChange={handleNewListNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateNewList} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
