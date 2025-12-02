import React, { useState } from 'react';

const ItemForms = ({ activeForm, onAddItem, editingItem, onUpdateItem, onCancelEdit }) => {
  const [taskData, setTaskData] = useState({
    task: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'Medium'
  });

  const [goalData, setGoalData] = useState({
    name: '',
    deadline: new Date().toISOString().split('T')[0]
  });

  const [eventData, setEventData] = useState({
    title: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00'
  });

  React.useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'tasks') {
        setTaskData({
          task: editingItem.task || '',
          date: editingItem.date || new Date().toISOString().split('T')[0],
          time: editingItem.time || '09:00',
          priority: editingItem.priority || 'Medium'
        });
      } else if (editingItem.type === 'goals') {
        setGoalData({
          name: editingItem.name || '',
          deadline: editingItem.deadline || new Date().toISOString().split('T')[0]
        });
      } else if (editingItem.type === 'events') {
        const start = editingItem.start ? new Date(editingItem.start) : new Date();
        const end = editingItem.end ? new Date(editingItem.end) : new Date();
        setEventData({
          title: editingItem.title || '',
          startDate: start.toISOString().split('T')[0],
          startTime: start.toTimeString().slice(0, 5),
          endDate: end.toISOString().split('T')[0],
          endTime: end.toTimeString().slice(0, 5)
        });
      }
    } else {
      setTaskData({
        task: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        priority: 'Medium'
      });
      setGoalData({
        name: '',
        deadline: new Date().toISOString().split('T')[0]
      });
      setEventData({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '10:00'
      });
    }
  }, [editingItem]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskData.task) return;

    const newTask = {
      ...taskData,
      completed: editingItem?.completed || false
    };

    if (editingItem) {
      onUpdateItem('tasks', editingItem.id, newTask);
    } else {
      onAddItem('tasks', newTask);
    }

    setTaskData({ task: '', date: new Date().toISOString().split('T')[0], time: '09:00', priority: 'Medium' });
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalData.name) return;

    const newGoal = {
      ...goalData,
      completed: editingItem?.completed || false
    };

    if (editingItem) {
      onUpdateItem('goals', editingItem.id, newGoal);
    } else {
      onAddItem('goals', newGoal);
    }

    setGoalData({ name: '', deadline: new Date().toISOString().split('T')[0] });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    if (!eventData.title) return;

    const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
    const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }

    const newEvent = {
      title: eventData.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    };

    if (editingItem) {
      onUpdateItem('events', editingItem.id, newEvent);
    } else {
      onAddItem('events', newEvent);
    }

    if (!editingItem) {
      setEventData({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endDate: new Date().toISOString().split('T')[0],
        endTime: '10:00'
      });
    }
  };

  if (editingItem) {
    return (
      <div className="card">
        <p className="section-header">Editing {editingItem.type.slice(0, -1)}</p>
        
        {editingItem.type === 'tasks' && (
          <form onSubmit={handleTaskSubmit}>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={taskData.task}
                    onChange={(e) => setTaskData({...taskData, task: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={taskData.date}
                    onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={taskData.time}
                    onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={taskData.priority}
                    onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {editingItem.type === 'goals' && (
          <form onSubmit={handleGoalSubmit}>
            <div className="form-group">
              <label className="form-label">Goal Description</label>
              <input
                type="text"
                className="form-control"
                value={goalData.name}
                onChange={(e) => setGoalData({...goalData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                className="form-control"
                value={goalData.deadline}
                onChange={(e) => setGoalData({...goalData, deadline: e.target.value})}
                required
              />
            </div>
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {editingItem.type === 'events' && (
          <form onSubmit={handleEventSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                className="form-control"
                value={eventData.title}
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
                required
              />
            </div>
            <div className="row">
              <div className="col-6">
                <h4>Start</h4>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventData.startDate}
                    onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={eventData.startTime}
                    onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <h4>End</h4>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={eventData.endDate}
                    onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={eventData.endTime}
                    onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      {activeForm === 'task' && (
        <form onSubmit={handleTaskSubmit}>
          <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Create New Task</h3>
          <div className="form-group">
            <label className="form-label">Task Name *</label>
            <input
              type="text"
              className="form-control"
              value={taskData.task}
              onChange={(e) => setTaskData({...taskData, task: e.target.value})}
              placeholder="Enter task description..."
              required
            />
          </div>
          <div className="row">
            <div className="col-6">
              <h4 style={{marginBottom: '1rem', color: '#667eea', textAlign: 'center'}}>Date & Time</h4>
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  value={taskData.date}
                  onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="time"
                  className="form-control"
                  value={taskData.time}
                  onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="col-6">
              <h4 style={{marginBottom: '1rem', color: '#667eea', textAlign: 'center'}}>Priority</h4>
              <div className="form-group">
                <select
                  className="form-control"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <button type="submit" className="btn btn-primary" style={{minWidth: '150px'}}>Add Task</button>
          </div>
        </form>
      )}

      {activeForm === 'goal' && (
        <form onSubmit={handleGoalSubmit}>
          <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Create New Goal</h3>
          <div className="form-group">
            <label className="form-label">Goal Description *</label>
            <input
              type="text"
              className="form-control"
              value={goalData.name}
              onChange={(e) => setGoalData({...goalData, name: e.target.value})}
              placeholder="What do you want to achieve?"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              className="form-control"
              value={goalData.deadline}
              onChange={(e) => setGoalData({...goalData, deadline: e.target.value})}
            />
          </div>
          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <button type="submit" className="btn btn-primary" style={{minWidth: '150px'}}>Add Goal</button>
          </div>
        </form>
      )}

      {activeForm === 'event' && (
        <form onSubmit={handleEventSubmit}>
          <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Create New Event</h3>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-control"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Enter event name..."
              required
            />
          </div>
          <div className="row">
            <div className="col-6">
              <h4 style={{marginBottom: '1rem', color: '#667eea', textAlign: 'center'}}>Start</h4>
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({...eventData, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="time"
                  className="form-control"
                  value={eventData.startTime}
                  onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
                />
              </div>
            </div>
            <div className="col-6">
              <h4 style={{marginBottom: '1rem', color: '#667eea', textAlign: 'center'}}>End</h4>
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({...eventData, endDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <input
                  type="time"
                  className="form-control"
                  value={eventData.endTime}
                  onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <button type="submit" className="btn btn-primary" style={{minWidth: '150px'}}>Add Event</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ItemForms;