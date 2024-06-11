import axios from 'axios';

export const fetchTasksByList = (listName, setTasks) => {
  axios.get(`http://localhost:8080/tagsbyname?tag=${listName}`)
    .then(response => {
      const tasks = response.data || []; // Default to empty array if response.data is null
      setTasks(tasks);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Set an empty array on error
    });
};

export const fetchTasksByCategory = (categoryName, setTasks) => {
  let endpoint;

  switch (categoryName) {
    case 'Today':
      endpoint = 'http://localhost:8080/tasks?category=today';
      break;
    case 'Tomorrow':
      endpoint = 'http://localhost:8080/tasks?category=tomorrow';
      break;
    case 'After tomorrow':
      endpoint = 'http://localhost:8080/tasks?category=after-tomorrow';
      break;
    case 'Past':
      endpoint = 'http://localhost:8080/tasks?category=past';
      break;
    case 'All':
      endpoint = 'http://localhost:8080/tasks?category=all';
      break;
    default:
      console.error('Unknown category:', categoryName);
      return;
  }

  axios.get(endpoint)
    .then(response => {
      const tasks = response.data || []; // Default to empty array if response.data is null
      setTasks(tasks);
    })
    .catch(error => {
      console.error('Error fetching tasks by category:', error);
      setTasks([]); // Set an empty array on error
    });
};

export const handleListClick = (listNameOrCategoryName, setSelectedList, fetchTasksByList, fetchTasksByCategory, setTasks) => {
  if (!listNameOrCategoryName) {
    console.error('Invalid list or category name:', listNameOrCategoryName);
    return;
  }

  setSelectedList(listNameOrCategoryName);

  if (['Today', 'Tomorrow', 'After tomorrow', 'Past', 'All'].includes(listNameOrCategoryName)) {
    fetchTasksByCategory(listNameOrCategoryName, setTasks);
  } else {
    fetchTasksByList(listNameOrCategoryName, setTasks);
  }
};

export const deleteTask = async (taskId, setTasks) => {
  try {
    const response = await axios.delete(`http://localhost:8080/tasksdelete?id=${taskId}`);
    if (response.status === 200) {
      console.log('Task deleted successfully');
      // Optionally, refresh the task list by refetching tasks
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else {
      console.error('Error deleting task:', response);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const toggleTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(`http://localhost:8080/toggletaskstatus?id=${taskId}`, { status });
    if (response.status === 200) {
      console.log('Task status toggled successfully');
      // Optionally, refresh the task list by refetching tasks
      // Assuming response.data contains the updated task
      // setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? response.data : task)));
    } else {
      console.error('Error toggling task status:', response);
    }
  } catch (error) {
    console.error('Error toggling task status:', error);
  }
};