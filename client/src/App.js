import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NewTaskForm from './components/NewTaskForm';
import TaskList from './components/TaskList';
import { handleListClick, fetchTasksByList, fetchTasksByCategory, deleteTask , toggleTaskStatus} from './components/Query';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleListsUpdate = (newList) => {
    setLists(newList);
  };

  const handleSidebarListClick = (listNameOrCategoryName) => {
    handleListClick(listNameOrCategoryName, setSelectedList, fetchTasksByList, fetchTasksByCategory, setTasks);
  };

  const handleTaskToggle = (index) => {
      const updatedTasks = tasks.map((task, i) => {
        if (i === index) {
          toggleTaskStatus(task.id, true);
          return { ...task, status: true }; // Toggle the status of the clicked task
        }
        return task;
      });
      setTasks(updatedTasks);
  };

  const handleTaskUndo = (index) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        toggleTaskStatus(task.id, false);
        return { ...task, status: false }; // Set the status to false
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId) => {
    deleteTask(taskId, setTasks);
  };

  useEffect(() => {
    if (selectedList) {
      fetchTasksByCategory(selectedList, setTasks);
    }
  }, [selectedList]);

  useEffect(() => {
    fetchTasksByCategory('Today', setTasks);
  }, []);

  return (
    <div className="App">
      <Sidebar onListsUpdate={handleListsUpdate} onListClick={handleSidebarListClick} />
      <div className="main-content">
        <Header />
        <NewTaskForm addTask={addTask} lists={lists} />
        <TaskList tasks={tasks} onTaskToggle={handleTaskToggle} onTaskUndo={handleTaskUndo} onTaskDelete={handleTaskDelete} />
      </div>
    </div>
  );
}

export default App;
