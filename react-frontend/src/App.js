import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FiLogOut, FiPlus } from 'react-icons/fi';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ItemForms from './components/ItemForms';
import WeeklyView from './components/WeeklyView';
import DataTables from './components/DataTables';
import CalendarView from './components/CalendarView';
import Reminders from './components/Reminders';
import authService from './services/authService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeForm, setActiveForm] = useState('task');
  const [editingItem, setEditingItem] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      loadUserData(user);
    }
  }, []);

  const loadUserData = (username) => {
    const userData = authService.loadUserData(username);
    setTasks(userData.tasks || []);
    setGoals(userData.goals || []);
    setEvents(userData.events || []);
  };

  const saveUserData = () => {
    if (currentUser) {
      const userData = { tasks, goals, events };
      authService.saveUserData(currentUser, userData);
    }
  };

  // Save data whenever tasks, goals, or events change
  useEffect(() => {
    if (isLoggedIn) {
      saveUserData();
    }
  }, [tasks, goals, events, isLoggedIn]);

  const handleLogin = (username, userData) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    setTasks(userData.tasks || []);
    setGoals(userData.goals || []);
    setEvents(userData.events || []);
  };

  const handleLogout = () => {
    saveUserData();
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser('');
    setTasks([]);
    setGoals([]);
    setEvents([]);
    setEditingItem(null);
  };

  const generateUniqueId = (items) => {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 0;
  };

  const handleAddItem = (type, itemData) => {
    const newId = generateUniqueId(type === 'tasks' ? tasks : type === 'goals' ? goals : events);
    const newItem = { ...itemData, id: newId };

    if (type === 'tasks') {
      setTasks([...tasks, newItem]);
    } else if (type === 'goals') {
      setGoals([...goals, newItem]);
    } else if (type === 'events') {
      setEvents([...events, newItem]);
    }
    
    toast.success(`${type.slice(0, -1)} added successfully`);
  };

  const handleUpdateItem = (type, itemId, updatedData) => {
    if (type === 'tasks') {
      setTasks(tasks.map(task => 
        task.id === itemId ? { ...task, ...updatedData } : task
      ));
    } else if (type === 'goals') {
      setGoals(goals.map(goal => 
        goal.id === itemId ? { ...goal, ...updatedData } : goal
      ));
    } else if (type === 'events') {
      setEvents(events.map(event => 
        event.id === itemId ? { ...event, ...updatedData } : event
      ));
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (type, itemId) => {
    const itemName = type === 'tasks' ? tasks.find(t => t.id === itemId)?.task :
                     type === 'goals' ? goals.find(g => g.id === itemId)?.name :
                     events.find(e => e.id === itemId)?.title;
    
    if (window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      if (type === 'tasks') {
        setTasks(tasks.filter(task => task.id !== itemId));
      } else if (type === 'goals') {
        setGoals(goals.filter(goal => goal.id !== itemId));
      } else if (type === 'events') {
        setEvents(events.filter(event => event.id !== itemId));
      }
      
      // Clear editing state if deleting the item being edited
      if (editingItem && editingItem.id === itemId) {
        setEditingItem(null);
      }
      
      toast.success(`${type.slice(0, -1)} deleted successfully`);
    }
  };

  const handleEditItem = (type, item) => {
    setEditingItem({ ...item, type });
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleToggleGoal = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      {/* Header */}
      <header className="row" style={{ alignItems: 'center', marginBottom: '2rem' }}>
        <div className="col-6">
          <h1 className="main-title">Virtual Planner</h1>
        </div>
        <div className="col-4">
          <div className="user-badge" role="status" aria-label={`Logged in as ${currentUser}`}>{currentUser}</div>
        </div>
        <div className="col-2">
          <button className="btn btn-secondary" onClick={handleLogout} aria-label="Logout from application">
            <FiLogOut style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </header>

      <hr />

      {/* Dashboard */}
      <Dashboard tasks={tasks} goals={goals} events={events} />

      <hr />

      {/* Add New Item Buttons */}
      <section>
        <h2 className="section-header">Add New Item</h2>
        <div className="row" role="group" aria-label="Add new item options">
          <div className="col-4">
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                setActiveForm('task');
                setEditingItem(null);
              }}
              aria-pressed={activeForm === 'task'}
            >
              <FiPlus style={{ marginRight: '0.5rem' }} />
            ADD TASK
            </button>
          </div>
          <div className="col-4">
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                setActiveForm('goal');
                setEditingItem(null);
              }}
              aria-pressed={activeForm === 'goal'}
            >
              <FiPlus style={{ marginRight: '0.5rem' }} />
            ADD GOAL
            </button>
          </div>
          <div className="col-4">
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                setActiveForm('event');
                setEditingItem(null);
              }}
              aria-pressed={activeForm === 'event'}
            >
              <FiPlus style={{ marginRight: '0.5rem' }} />
            ADD EVENT
            </button>
          </div>
        </div>
      </section>

      <br />

      {/* Item Forms */}
      <ItemForms 
        activeForm={activeForm}
        onAddItem={handleAddItem}
        editingItem={editingItem}
        onUpdateItem={handleUpdateItem}
        onCancelEdit={() => setEditingItem(null)}
      />

      <hr />

      {/* Weekly View */}
      <WeeklyView 
        tasks={tasks} 
        goals={goals} 
        events={events} 
        onToggleTask={handleToggleTask} 
        onToggleGoal={handleToggleGoal}
        onEditTask={(task) => handleEditItem('tasks', task)}
        onEditGoal={(goal) => handleEditItem('goals', goal)}
        onEditEvent={(event) => handleEditItem('events', event)}
      />

      <hr />

      {/* Data Tables */}
      <DataTables 
        tasks={tasks}
        goals={goals}
        events={events}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />

      <hr />

      {/* Calendar View */}
      <CalendarView 
        tasks={tasks}
        goals={goals}
        events={events}
        onToggleGoal={handleToggleGoal}
      />
      
      <hr />
      
      <Reminders tasks={tasks} goals={goals} events={events} />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;