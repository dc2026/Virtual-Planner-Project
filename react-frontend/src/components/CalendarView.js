import React, { useState } from 'react';

const CalendarView = ({ tasks, goals, events, onToggleGoal }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarView, setCalendarView] = useState('month');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF4B4B';
      case 'Medium': return '#FFC000';
      case 'Low': return '#4BCB58';
      default: return '#666';
    }
  };

  const getItemsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    
    const dayTasks = tasks.filter(task => 
      task.date === dateString && !task.completed
    );
    
    const dayGoals = goals.filter(goal => 
      goal.deadline === dateString && !goal.completed
    );
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === dateString;
    });

    return { tasks: dayTasks, goals: dayGoals, events: dayEvents };
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const items = getItemsForDate(date);
      const totalItems = items.tasks.length + items.goals.length + items.events.length;
      
      if (totalItems > 0) {
        return (
          <div style={{ 
            fontSize: '0.7rem', 
            marginTop: '2px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1px'
          }}>
            {items.tasks.slice(0, 2).map((task, i) => (
              <div 
                key={i}
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%',
                  backgroundColor: getPriorityColor(task.priority)
                }}
              />
            ))}
            {items.goals.slice(0, 1).map((goal, i) => (
              <div 
                key={i}
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%',
                  backgroundColor: '#3498DB'
                }}
              />
            ))}
            {items.events.slice(0, 1).map((event, i) => (
              <div 
                key={i}
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%',
                  backgroundColor: '#9b59b6'
                }}
              />
            ))}
            {totalItems > 4 && (
              <span style={{ fontSize: '0.6rem', color: '#666' }}>+</span>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const items = getItemsForDate(date);
    if (items.tasks.length > 0 || items.goals.length > 0 || items.events.length > 0) {
      setSelectedEvent(items);
    } else {
      setSelectedEvent(null);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const MonthView = ({ selectedDate, onDateClick, getItemsForDate, getPriorityColor }) => {
    const today = new Date();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ padding: '0.5rem', backgroundColor: '#f8f9fa', textAlign: 'center', fontWeight: 'bold' }}>
              {day}
            </div>
          ))}
          {days.map((date, i) => {
            const items = getItemsForDate(date);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <div 
                key={i}
                onClick={() => onDateClick(date)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: isSelected ? '#764ba2' : isToday ? '#667eea' : '#fff',
                  color: isSelected || isToday ? 'white' : isCurrentMonth ? '#333' : '#ccc',
                  cursor: 'pointer',
                  minHeight: '60px',
                  border: '1px solid #eee'
                }}
              >
                <div style={{ fontWeight: isToday ? 'bold' : 'normal' }}>{date.getDate()}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '4px' }}>
                  {items.tasks.slice(0, 2).map((task, j) => (
                    <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getPriorityColor(task.priority) }} />
                  ))}
                  {items.goals.slice(0, 1).map((goal, j) => (
                    <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3498DB' }} />
                  ))}
                  {items.events.slice(0, 1).map((event, j) => (
                    <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9b59b6' }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const WeekView = ({ selectedDate, onDateClick, getItemsForDate, getPriorityColor, formatTime }) => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Week of {startOfWeek.toLocaleDateString()}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
          {weekDays.map((date, i) => {
            const items = getItemsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div key={i} onClick={() => onDateClick(date)} style={{ 
                padding: '1rem', 
                backgroundColor: isToday ? '#667eea' : '#f8f9fa',
                color: isToday ? 'white' : '#333',
                cursor: 'pointer',
                minHeight: '200px',
                border: '1px solid #ddd'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  <br />
                  {date.getDate()}
                </div>
                {items.tasks.map(task => (
                  <div key={task.id} style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: getPriorityColor(task.priority) }}>●</span> {task.task}
                    <br />
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{formatTime(task.time)}</span>
                  </div>
                ))}
                {items.events.map(event => (
                  <div key={event.id} style={{ fontSize: '0.8rem', marginBottom: '0.25rem', color: '#9b59b6' }}>
                    ● {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const DayView = ({ selectedDate, getItemsForDate, getPriorityColor, formatTime, formatDateTime }) => {
    const items = getItemsForDate(selectedDate);
    
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          {items.tasks.length === 0 && items.goals.length === 0 && items.events.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No items for this day</p>
          ) : (
            <div>
              {items.tasks.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea' }}>📝 Tasks</h4>
                  {items.tasks.map(task => (
                    <div key={task.id} style={{ 
                      padding: '0.75rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{task.task}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        🕐 {formatTime(task.time)} | ⚡ {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {items.goals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea' }}>🎯 Goals</h4>
                  {items.goals.map(goal => (
                    <div key={goal.id} style={{ 
                      padding: '0.75rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      borderLeft: '4px solid #3498DB',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => onToggleGoal(goal.id)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', textDecoration: goal.completed ? 'line-through' : 'none' }}>{goal.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>📅 Deadline</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {items.events.length > 0 && (
                <div>
                  <h4 style={{ color: '#667eea' }}>📅 Events</h4>
                  {items.events.map(event => (
                    <div key={event.id} style={{ 
                      padding: '0.75rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      borderLeft: '4px solid #9b59b6'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        ⏰ {formatDateTime(event.start)}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        ⏰ {formatDateTime(event.end)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <p className="section-header">🗓️ Calendar View</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <div className="row">
          <div className="col-6">
            <h3>View:</h3>
          </div>
          <div className="col-6">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn ${calendarView === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('month')}
              >
                Month
              </button>
              <button 
                className={`btn ${calendarView === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('week')}
              >
                Week
              </button>
              <button 
                className={`btn ${calendarView === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className={calendarView === 'day' ? 'col-12' : 'col-8'}>
          <div className="card">
            {calendarView === 'month' && (
              <div className="month-view">
                <MonthView 
                  selectedDate={selectedDate}
                  onDateClick={handleDateClick}
                  getItemsForDate={getItemsForDate}
                  getPriorityColor={getPriorityColor}
                />
              </div>
            )}
            
            {calendarView === 'week' && (
              <div className="week-view">
                <WeekView 
                  selectedDate={selectedDate}
                  onDateClick={handleDateClick}
                  getItemsForDate={getItemsForDate}
                  getPriorityColor={getPriorityColor}
                  formatTime={formatTime}
                />
              </div>
            )}
            
            {calendarView === 'day' && (
              <div className="day-view">
                <DayView 
                  selectedDate={selectedDate}
                  getItemsForDate={getItemsForDate}
                  getPriorityColor={getPriorityColor}
                  formatTime={formatTime}
                  formatDateTime={formatDateTime}
                />
              </div>
            )}
          </div>
        </div>
        
        {calendarView !== 'day' && (
          <div className="col-4">
          {selectedEvent ? (
            <div className="card">
              <h3>📅 {selectedDate.toLocaleDateString()}</h3>
              
              {selectedEvent.tasks.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📝 Tasks</h4>
                  {selectedEvent.tasks.map(task => (
                    <div key={task.id} style={{ 
                      padding: '0.5rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{task.task}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        🕐 {formatTime(task.time)} | ⚡ {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedEvent.goals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🎯 Goals</h4>
                  {selectedEvent.goals.map(goal => (
                    <div key={goal.id} style={{ 
                      padding: '0.5rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px',
                      borderLeft: '4px solid #3498DB',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => onToggleGoal(goal.id)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold', textDecoration: goal.completed ? 'line-through' : 'none' }}>{goal.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          📅 Deadline
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedEvent.events.length > 0 && (
                <div>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📅 Events</h4>
                  {selectedEvent.events.map(event => (
                    <div key={event.id} style={{ 
                      padding: '0.5rem', 
                      marginBottom: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '5px',
                      borderLeft: '4px solid #9b59b6'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        ⏰ {formatDateTime(event.start)}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        ⏰ {formatDateTime(event.end)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <h3>📅 {selectedDate.toLocaleDateString()}</h3>
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No items scheduled for this date.
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                <p><strong>Color Legend</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF4B4B', marginRight: '0.5rem' }}></div>
                  High Priority Tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFC000', marginRight: '0.5rem' }}></div>
                  Medium Priority Tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4BCB58', marginRight: '0.5rem' }}></div>
                  Low Priority Tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3498DB', marginRight: '0.5rem' }}></div>
                  Goals
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9b59b6', marginRight: '0.5rem' }}></div>
                  Events
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </div>


    </div>
  );
};

export default CalendarView;