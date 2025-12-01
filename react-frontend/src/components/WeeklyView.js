import React from 'react';

const WeeklyView = ({ tasks, onToggleTask }) => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    weekDays.push(day);
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      case 'Low': return '🟢';
      default: return '⚪';
    }
  };

  const getTasksForDay = (day) => {
    const dayString = day.toISOString().split('T')[0];
    return tasks
      .filter(task => task.date === dayString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const isToday = (day) => {
    return day.toDateString() === today.toDateString();
  };

  return (
    <div>
      <p className="section-header">📅 This Week's Schedule</p>
      
      <div className="row">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const dayLabel = isToday(day) ? '🔵 TODAY' : day.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div key={index} className="col" style={{ minWidth: '150px' }}>
              <div className={`week-day ${isToday(day) ? 'today' : ''}`}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {dayLabel}
                  <br />
                  {day.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </div>
                
                {dayTasks.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic', marginTop: '1rem' }}>
                    No tasks
                  </p>
                ) : (
                  dayTasks.map(task => (
                    <div key={task.id} style={{ marginBottom: '0.5rem', textAlign: 'left' }}>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task.id)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>
                          {getPriorityColor(task.priority)} {task.task}
                        </span>
                      </label>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginLeft: '1.5rem' }}>
                        🕐 {formatTime(task.time)}
                      </div>
                    </div>
                  ))
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