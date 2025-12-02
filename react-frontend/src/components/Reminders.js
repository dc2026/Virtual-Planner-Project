import React, { useState, useEffect } from 'react';
import { format, parseISO, isToday, isBefore, addDays } from 'date-fns';
import { FiBell, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Reminders = ({ tasks, goals, events }) => {
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [customReminder, setCustomReminder] = useState({ title: '', date: '', time: '', message: '', linkedItem: '' });

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const newReminders = [];

      // Check overdue tasks
      tasks.forEach(task => {
        if (!task.completed && task.date) {
          const [year, month, day] = task.date.split('-').map(Number);
          const taskDate = new Date(year, month - 1, day, 12, 0, 0);
          const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
          
          if (taskDate < todayDate) {
            newReminders.push({
              id: `task-${task.id}`,
              type: 'overdue',
              title: task.task,
              message: `Task "${task.task}" is overdue`,
              date: task.date,
              priority: 'high'
            });
          } else if (taskDate.getTime() === todayDate.getTime()) {
            newReminders.push({
              id: `task-today-${task.id}`,
              type: 'today',
              title: task.task,
              message: `Task "${task.task}" is due today`,
              date: task.date,
              priority: 'medium'
            });
          }
        }
      });

      // Check goal deadlines
      goals.forEach(goal => {
        if (!goal.completed && goal.deadline) {
          const [year, month, day] = goal.deadline.split('-').map(Number);
          const goalDate = new Date(year, month - 1, day, 12, 0, 0);
          const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
          
          if (goalDate.getTime() === todayDate.getTime()) {
            newReminders.push({
              id: `goal-${goal.id}`,
              type: 'deadline',
              title: goal.name,
              message: `Goal "${goal.name}" deadline is today`,
              date: goal.deadline,
              priority: 'medium'
            });
          }
        }
      });

      // Check today's events
      events.forEach(event => {
        if (event.start) {
          const eventDate = parseISO(event.start);
          if (isToday(eventDate)) {
            newReminders.push({
              id: `event-${event.id}`,
              type: 'event',
              title: event.title,
              message: `Event "${event.title}" is today at ${format(eventDate, 'h:mm a')}`,
              date: event.start,
              priority: 'low'
            });
          }
        }
      });

      setReminders(newReminders);
      
      // Show toast for high priority reminders
      newReminders.forEach(reminder => {
        if (reminder.priority === 'high') {
          toast.error(reminder.message, { duration: 5000 });
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [tasks, goals, events]);

  const dismissReminder = (reminderId) => {
    setReminders(reminders.filter(r => r.id !== reminderId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#D73027';
      case 'medium': return '#4575B4';
      case 'low': return '#91BFDB';
      default: return '#666';
    }
  };

  const getReminderIcon = (type) => {
    return <FiBell style={{ color: getPriorityColor(type === 'overdue' ? 'high' : type === 'deadline' ? 'medium' : 'low') }} />;
  };

  if (reminders.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={() => setShowReminders(!showReminders)}
        className="btn btn-primary"
        style={{ 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          position: 'relative',
          padding: '0'
        }}
        aria-label={`${reminders.length} reminders`}
      >
        <FiBell />
        {reminders.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#D73027',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {reminders.length}
          </span>
        )}
      </button>

      {showReminders && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '0',
          width: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1001
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <h4 style={{ margin: '0', color: '#2c3e50' }}>Reminders</h4>
          </div>
          
          {reminders.map(reminder => (
            <div key={reminder.id} style={{
              padding: '0.75rem',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              {getReminderIcon(reminder.type)}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '500', 
                  color: '#2c3e50',
                  fontSize: '0.9rem',
                  marginBottom: '0.25rem'
                }}>
                  {reminder.message}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#666'
                }}>
                  {reminder.date}
                </div>
              </div>
              <button
                onClick={() => dismissReminder(reminder.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0.25rem'
                }}
                aria-label="Dismiss reminder"
              >
                <FiX />
              </button>
            </div>
          ))}
          
          <div style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
            <button
              onClick={() => setShowAddReminder(!showAddReminder)}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.9rem' }}
            >
              + Add Custom Reminder
            </button>
            
            {showAddReminder && (
              <div style={{ marginTop: '1rem' }}>
                <select
                  value={customReminder.linkedItem || ''}
                  onChange={(e) => {
                    const [type, id] = e.target.value.split('-');
                    if (type && id) {
                      const item = type === 'task' ? tasks.find(t => t.id == id) :
                                   type === 'goal' ? goals.find(g => g.id == id) :
                                   type === 'event' ? events.find(e => e.id == id) : null;
                      if (item) {
                        setCustomReminder({
                          ...customReminder,
                          linkedItem: e.target.value,
                          title: type === 'task' ? item.task : type === 'goal' ? item.name : item.title,
                          date: type === 'task' ? item.date : type === 'goal' ? item.deadline : item.start.split('T')[0]
                        });
                      }
                    } else {
                      setCustomReminder({...customReminder, linkedItem: '', title: '', date: ''});
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Create custom reminder or link to existing item</option>
                  <optgroup label="Tasks">
                    {tasks.filter(t => !t.completed).map(task => (
                      <option key={`task-${task.id}`} value={`task-${task.id}`}>
                        {task.task} ({task.date})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Goals">
                    {goals.filter(g => !g.completed).map(goal => (
                      <option key={`goal-${goal.id}`} value={`goal-${goal.id}`}>
                        {goal.name} ({goal.deadline})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Events">
                    {events.map(event => (
                      <option key={`event-${event.id}`} value={`event-${event.id}`}>
                        {event.title} ({event.start.split('T')[0]})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <input
                  type="text"
                  placeholder="Reminder title"
                  value={customReminder.title}
                  onChange={(e) => setCustomReminder({...customReminder, title: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="date"
                  value={customReminder.date}
                  onChange={(e) => setCustomReminder({...customReminder, date: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="time"
                  value={customReminder.time}
                  onChange={(e) => setCustomReminder({...customReminder, time: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      if (customReminder.title && customReminder.date) {
                        const newReminder = {
                          id: `custom-${Date.now()}`,
                          type: 'custom',
                          title: customReminder.title,
                          message: customReminder.title,
                          date: customReminder.date,
                          time: customReminder.time,
                          priority: 'medium'
                        };
                        setReminders([...reminders, newReminder]);
                        setCustomReminder({ title: '', date: '', time: '', message: '', linkedItem: '' });
                        setShowAddReminder(false);
                        toast.success('Custom reminder added!');
                      }
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddReminder(false);
                      setCustomReminder({ title: '', date: '', time: '', message: '', linkedItem: '' });
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;