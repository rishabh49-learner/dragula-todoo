import React, { useState, useEffect, useRef } from 'react';
import dragula from 'dragula';
import './App.css';
 
function App() {
  // State for tasks in both columns
  const [pendingTasks, setPendingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  
  // Refs for the container elements
  const pendingContainerRef = useRef(null);
  const doneContainerRef = useRef(null);
  const dragulaRef = useRef(null);
 
  // I
  useEffect(() => {
  if (pendingContainerRef.current && doneContainerRef.current) {
    dragulaRef.current = dragula([
      pendingContainerRef.current,
      doneContainerRef.current
    ]);

    dragulaRef.current.on('drop', (el, target, source) => {
      const taskId = el.dataset.id;

      // Prevent Dragula from moving DOM elements directly
      dragulaRef.current.cancel(true);

      const task =
        pendingTasks.find((t) => t.id === taskId) ||
        doneTasks.find((t) => t.id === taskId);

      if (!task) return;

      if (target === doneContainerRef.current) {
        // Move to done
        setPendingTasks((prev) => prev.filter((t) => t.id !== taskId));
        setDoneTasks((prev) => [...prev, task]);
      } else if (target === pendingContainerRef.current) {
        // Move back to pending
        setDoneTasks((prev) => prev.filter((t) => t.id !== taskId));
        setPendingTasks((prev) => [...prev, task]);
      }
    });
  }

  return () => {
    if (dragulaRef.current) {
      dragulaRef.current.destroy();
    }
  };
}, [pendingTasks, doneTasks]);

 
  // Add a new task
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: Date.now().toString(),
        text: newTask
      };
      setPendingTasks([...pendingTasks, newTaskObj]);
      setNewTask('');
    }
  };
 
  return (
    <div className="app-container">
      <h1>ToDo List with Drag-and-Drop</h1>
      
      {/* Form to add new tasks */}
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>
      
      <div className="columns-container">
        {/* Pending tasks column */}
        <div className="column">
          <h2>Pending</h2>
          <div className="task-list" ref={pendingContainerRef}>
            {pendingTasks.map(task => (
              <div
key={task.id}
data-id={task.id}
                className="task-card"
              >
                {task.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Done tasks column */}
        <div className="column">
          <h2>Done</h2>
          <div className="task-list" ref={doneContainerRef}>
            {doneTasks.map(task => (
              <div
key={task.id}
data-id={task.id}
                className="task-card done"
              >
                {task.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default App;