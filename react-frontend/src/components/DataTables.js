import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi';

const DataTables = ({ tasks, goals, events, onEditItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const formatDateTime = (dateString, timeString = null) => {
    const date = new Date(dateString);
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  };

  const formatISODateTime = (isoString) => {
    try {
      const date = parseISO(isoString);
      return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (completed) => {
    return completed ? 'status-completed' : 'status-pending';
  };

  const getStatusText = (completed) => {
    return completed ? (
      <><FiCheck style={{ marginRight: '0.25rem' }} />Done</>
    ) : (
      <><FiClock style={{ marginRight: '0.25rem' }} />Pending</>
    );
  };

  return (
    <div>
      <h2 className="section-header">Manage Your Items</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div>
          {tasks.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks
                    .sort((a, b) => {
                      if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                      }
                      return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
                    })
                    .map(task => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.task}</td>
                        <td>{task.date}</td>
                        <td>{task.time}</td>
                        <td className={getPriorityClass(task.priority)}>{task.priority}</td>
                        <td className={getStatusClass(task.completed)}>
                          {getStatusText(task.completed)}
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary" 
                            style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                            onClick={() => onEditItem('tasks', task)}
                            aria-label={`Edit task: ${task.task}`}
                          >
                            <FiEdit2 style={{ marginRight: '0.25rem' }} />
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => onDeleteItem('tasks', task.id)}
                            aria-label={`Delete task: ${task.task}`}
                          >
                            <FiTrash2 style={{ marginRight: '0.25rem' }} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              color: '#666'
            }}>
              No tasks yet. Create your first task above!
            </div>
          )}
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          {goals.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Goal</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(goal => (
                  <tr key={goal.id}>
                    <td>{goal.id}</td>
                    <td>{goal.name}</td>
                    <td>{goal.deadline}</td>
                    <td className={getStatusClass(goal.completed)}>
                      {goal.completed ? 'Done' : 'In Progress'}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                        onClick={() => onEditItem('goals', goal)}
                        aria-label={`Edit goal: ${goal.name}`}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => onDeleteItem('goals', goal.id)}
                        aria-label={`Delete goal: ${goal.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              color: '#666'
            }}>
              No goals yet. Set your first goal above!
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div>
          {events.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.title}</td>
                    <td>{formatISODateTime(event.start)}</td>
                    <td>{formatISODateTime(event.end)}</td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}
                        onClick={() => onEditItem('events', event)}
                        aria-label={`Edit event: ${event.title}`}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => onDeleteItem('events', event.id)}
                        aria-label={`Delete event: ${event.title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '10px',
              color: '#666'
            }}>
              No events yet. Schedule your first event above!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTables;