import React from 'react';
import { format, parseISO, isValid } from 'date-fns';

const WeeklyView = ({ tasks, goals, events, onToggleTask, onToggleGoal, onEditTask, onEditGoal, onEditEvent }) => {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 12, 0, 0);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'No time set';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return 'Invalid time';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#D73027';
      case 'Medium': return '#4575B4';
      case 'Low': return '#91BFDB';
      default: return '#666';
    }
  };

  const getItemsForDay = (day) => {
    const dayString = format(day, 'yyyy-MM-dd');
    
    const dayTasks = tasks
      .filter(task => {
        if (!task.date) return false;
        try {
          const taskDate = task.date.includes('T') ? task.date.split('T')[0] : task.date;
          return taskDate === dayString;
        } catch {
          return false;
        }
      })
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    
    const dayGoals = goals
      .filter(goal => {
        if (!goal.deadline) return false;
        try {
          const goalDate = goal.deadline.includes('T') ? goal.deadline.split('T')[0] : goal.deadline;
          return goalDate === dayString;
        } catch {
          return false;
        }
      });
    
    const dayEvents = events
      .filter(event => {
        if (!event.start) return false;
        try {
          const eventDate = parseISO(event.start);
          return isValid(eventDate) && format(eventDate, 'yyyy-MM-dd') === dayString;
        } catch {
          return false;
        }
      });
    
    return { tasks: dayTasks, goals: dayGoals, events: dayEvents };
  };

  const isToday = (day) => {
    const todayLocal = new Date();
    const todayYear = todayLocal.getFullYear();
    const todayMonth = todayLocal.getMonth();
    const todayDate = todayLocal.getDate();
    
    return day.getFullYear() === todayYear && 
           day.getMonth() === todayMonth && 
           day.getDate() === todayDate;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 className="section-header" style={{ margin: 0 }}>This Week's Schedule</h2>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          Click items to edit • Check boxes to complete
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {weekDays.map((day, index) => {
          const dayItems = getItemsForDay(day);
          const dayLabel = isToday(day) ? 'TODAY' : day.toLocaleDateString('en-US', { weekday: 'short' });
          const totalItems = dayItems.tasks.length + dayItems.goals.length + dayItems.events.length;
          
          return (
            <div key={index} style={{ flex: '0 0 180px', minWidth: '180px' }}>
              <div className={`week-day ${isToday(day) ? 'today' : ''}`}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dayLabel}
                  <br />
                  {day.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </div>
                
                {totalItems === 0 ? (
                  <p style={{ color: isToday(day) ? 'rgba(255,255,255,0.8)' : '#999', fontStyle: 'italic', marginTop: '1rem' }}>
                    No items
                  </p>
                ) : (
                  <>
                    {dayItems.tasks.map(task => (
                      <div key={`task-${task.id}`} style={{ 
                        marginBottom: '0.5rem', 
                        textAlign: 'left',
                        padding: '0.5rem',
                        backgroundColor: isToday(day) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onClick={() => onEditTask && onEditTask(task)}
                      >
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleTask(task.id);
                            }}
                            style={{ marginTop: '0.1rem', flexShrink: 0 }}
                            aria-label={`Mark ${task.task} as ${task.completed ? 'incomplete' : 'complete'}`}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              color: isToday(day) ? 'white' : '#2c3e50',
                              textDecoration: task.completed ? 'line-through' : 'none',
                              lineHeight: '1.3'
                            }}>
                              {task.task}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: isToday(day) ? 'rgba(255,255,255,0.9)' : '#666',
                              marginTop: '0.25rem'
                            }}>
                              {formatTime(task.time)} • {task.priority || 'Medium'}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                    
                    {dayItems.goals.map(goal => (
                      <div key={`goal-${goal.id}`} style={{ 
                        marginBottom: '0.5rem', 
                        textAlign: 'left',
                        padding: '0.5rem',
                        backgroundColor: isToday(day) ? 'rgba(255,255,255,0.2)' : 'rgba(52,152,219,0.1)',
                        borderRadius: '6px',
                        borderLeft: '3px solid #3498DB',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onClick={() => onEditGoal && onEditGoal(goal)}
                      >
                        <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={goal.completed}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleGoal(goal.id);
                            }}
                            style={{ marginTop: '0.1rem', flexShrink: 0 }}
                            aria-label={`Mark ${goal.name} as ${goal.completed ? 'incomplete' : 'complete'}`}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              color: isToday(day) ? 'white' : '#2c3e50',
                              textDecoration: goal.completed ? 'line-through' : 'none',
                              lineHeight: '1.3'
                            }}>
                              {goal.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: isToday(day) ? 'rgba(255,255,255,0.9)' : '#666',
                              marginTop: '0.25rem'
                            }}>
                              Goal Deadline
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                    
                    {dayItems.events.map(event => (
                      <div key={`event-${event.id}`} style={{ 
                        marginBottom: '0.5rem', 
                        textAlign: 'left',
                        padding: '0.5rem',
                        backgroundColor: isToday(day) ? 'rgba(255,255,255,0.2)' : 'rgba(155,91,182,0.1)',
                        borderRadius: '6px',
                        borderLeft: '3px solid #9b59b6',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onClick={() => onEditEvent && onEditEvent(event)}
                      >
                        <div style={{ 
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: isToday(day) ? 'white' : '#2c3e50',
                          lineHeight: '1.3'
                        }}>
                          {event.title}
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: isToday(day) ? 'rgba(255,255,255,0.9)' : '#666',
                          marginTop: '0.25rem'
                        }}>
                          {format(parseISO(event.start), 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;