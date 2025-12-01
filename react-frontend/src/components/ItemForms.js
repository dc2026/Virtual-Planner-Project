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

  // Initialize form data when editing
  React.useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'tasks') {
        setTaskData({
          task: editingItem.task,
          date: editingItem.date,
          time: editingItem.time,
          priority: editingItem.priority
        });
      } else if (editingItem.type === 'goals') {
        setGoalData({
          name: editingItem.name,
          deadline: editingItem.deadline
        });
      } else if (editingItem.type === 'events') {
        const start = new Date(editingItem.start);
        const end = new Date(editingItem.end);
        setEventData({
          title: editingItem.title,
          startDate: start.toISOString().split('T')[0],
          startTime: start.toTimeString().slice(0, 5),
          endDate: end.toISOString().split('T')[0],
          endTime: end.toTimeString().slice(0, 5)
        });
      }
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

    const newEvent = {
      title: eventData.title,
      start: new Date(`${eventData.startDate}T${eventData.startTime}`).toISOString(),
      end: new Date(`${eventData.endDate}T${eventData.endTime}`).toISOString()
    };

    if (editingItem) {
      onUpdateItem('events', editingItem.id, newEvent);
    } else {
      onAddItem('events', newEvent);
    }

    setEventData({
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDate: new Date().toISOString().split('T')[0],
      endTime: '10:00'
    });
  };

  if (editingItem) {
    return (
      <div className="card">
        <p className="section-header">✏️ Editing {editingItem.type.slice(0, -1)}</p>
        
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
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">📅 Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={taskData.date}
                    onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label className="form-label">🕐 Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={taskData.time}
                    onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">⚡ Priority</label>
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
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">💾 Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  ❌ Cancel
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
              />
            </div>
            <div className="form-group">
              <label className="form-label">📅 Deadline</label>
              <input
                type="date"
                className="form-control"
                value={goalData.deadline}
                onChange={(e) => setGoalData({...goalData, deadline: e.target.value})}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">💾 Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  ❌ Cancel
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
              />
            </div>
            <div className="row">
              <div className="col-6">
                <h4>Start</h4>
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
                <h4>End</h4>
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
            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary">💾 Save</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
                  ❌ Cancel
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
          <h3>📝 Create New Task</h3>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label className="form-label">Task Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskData.task}
                  onChange={(e) => setTaskData({...taskData, task: e.target.value})}
                  placeholder="Enter task description..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">📅 Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={taskData.date}
                  onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label className="form-label">🕐 Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={taskData.time}
                  onChange={(e) => setTaskData({...taskData, time: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">⚡ Priority</label>
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
          <button type="submit" className="btn btn-primary">➕ Add Task</button>
        </form>
      )}

      {activeForm === 'goal' && (
        <form onSubmit={handleGoalSubmit}>
          <h3>🎯 Create New Goal</h3>
          <div className="form-group">
            <label className="form-label">Goal Description *</label>
            <input
              type="text"
              className="form-control"
              value={goalData.name}
              onChange={(e) => setGoalData({...goalData, name: e.target.value})}
              placeholder="What do you want to achieve?"
            />
          </div>
          <div className="form-group">
            <label className="form-label">📅 Deadline</label>
            <input
              type="date"
              className="form-control"
              value={goalData.deadline}
              onChange={(e) => setGoalData({...goalData, deadline: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary">➕ Add Goal</button>
        </form>
      )}

      {activeForm === 'event' && (
        <form onSubmit={handleEventSubmit}>
          <h3>📅 Create New Event</h3>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-control"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              placeholder="Enter event name..."
            />
          </div>
          <div className="row">
            <div className="col-6">
              <h4>Start</h4>
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
              <h4>End</h4>
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
          <button type="submit" className="btn btn-primary">➕ Add Event</button>
        </form>
      )}
    </div>
  );
};

export default ItemForms;