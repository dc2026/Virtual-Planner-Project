import React, { useState } from 'react';
import { format, parseISO, isValid, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek } from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CalendarView = ({ tasks, goals, events, onToggleGoal }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarView, setCalendarView] = useState('month');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#D73027';    // Red-orange (colorblind safe)
      case 'Medium': return '#4575B4';  // Blue (colorblind safe)
      case 'Low': return '#91BFDB';     // Light blue (colorblind safe)
      default: return '#666';
    }
  };

  const getItemsForDate = (date) => {
    // Use local date string to avoid timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const dayTasks = tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = task.date.includes('T') ? task.date.split('T')[0] : task.date;
      return taskDate === dateString && !task.completed;
    });
    
    const dayGoals = goals.filter(goal => {
      if (!goal.deadline) return false;
      const goalDate = goal.deadline.includes('T') ? goal.deadline.split('T')[0] : goal.deadline;
      return goalDate === dateString && !goal.completed;
    });
    
    const dayEvents = events.filter(event => {
      if (!event.start) return false;
      try {
        const eventDate = new Date(event.start);
        const eventDateString = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        return eventDateString === dateString;
      } catch {
        return false;
      }
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
    // Create new date to avoid timezone issues
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(localDate);
    const items = getItemsForDate(localDate);
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

  const MonthView = ({ selectedDate, setSelectedDate, onDateClick, getItemsForDate, getPriorityColor }) => {
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
    
    const goToPreviousMonth = () => {
      const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate(), 12, 0, 0);
      setSelectedDate(prevMonth);
    };
    
    const goToNextMonth = () => {
      const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate(), 12, 0, 0);
      setSelectedDate(nextMonth);
    };
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
          <button 
            onClick={goToPreviousMonth}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Previous month"
          >
            <FiChevronLeft />
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button 
            onClick={goToNextMonth}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Next month"
          >
            <FiChevronRight />
          </button>
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
            const isToday = date.getFullYear() === today.getFullYear() && 
                           date.getMonth() === today.getMonth() && 
                           date.getDate() === today.getDate();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <div 
                key={i}
                onClick={() => {
                  const clickedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
                  onDateClick(clickedDate);
                }}
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
  
  const WeekView = ({ selectedDate, setSelectedDate, onDateClick, getItemsForDate, getPriorityColor, formatTime }) => {
    const weekStart = startOfWeek(selectedDate);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      weekDays.push(date);
    }
    
    const goToPreviousWeek = () => {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedDate(prevWeek);
    };
    
    const goToNextWeek = () => {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
    };
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
          <button 
            onClick={goToPreviousWeek}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Previous week"
          >
            <FiChevronLeft />
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '200px', textAlign: 'center' }}>
            Week of {weekStart.toLocaleDateString()}
          </div>
          <button 
            onClick={goToNextWeek}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Next week"
          >
            <FiChevronRight />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weekDays.map((date, i) => {
            const items = getItemsForDate(date);
            const todayCheck = new Date();
            const isToday = date.getFullYear() === todayCheck.getFullYear() && 
                           date.getMonth() === todayCheck.getMonth() && 
                           date.getDate() === todayCheck.getDate();
            
            return (
              <div key={i} onClick={() => onDateClick(date)} style={{ 
                padding: '1rem', 
                backgroundColor: isToday ? '#667eea' : '#f8f9fa',
                color: isToday ? 'white' : '#2c3e50',
                cursor: 'pointer',
                minHeight: '80px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <div style={{ fontWeight: 'bold', minWidth: '60px', textAlign: 'center' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  <br />
                  {date.getDate()}
                </div>
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {items.tasks.map(task => (
                    <div key={task.id} style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                      color: isToday ? 'white' : '#2c3e50'
                    }}>
                      {task.task}
                      <div style={{ fontSize: '0.7rem', opacity: isToday ? 0.9 : 0.7, color: isToday ? 'white' : '#555' }}>{formatTime(task.time)}</div>
                    </div>
                  ))}
                  {items.events.map(event => (
                    <div key={event.id} style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : 'rgba(155,91,182,0.2)',
                      borderRadius: '4px',
                      borderLeft: '3px solid #9b59b6',
                      color: isToday ? 'white' : '#2c3e50'
                    }}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const DayView = ({ selectedDate, setSelectedDate, getItemsForDate, getPriorityColor, formatTime, formatDateTime }) => {
    const items = getItemsForDate(selectedDate);
    
    const goToPreviousDay = () => {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setSelectedDate(prevDay);
    };
    
    const goToNextDay = () => {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    };
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
          <button 
            onClick={goToPreviousDay}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Previous day"
          >
            <FiChevronLeft />
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '300px', textAlign: 'center' }}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <button 
            onClick={goToNextDay}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            aria-label="Next day"
          >
            <FiChevronRight />
          </button>
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          {items.tasks.length === 0 && items.goals.length === 0 && items.events.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No items for this day</p>
          ) : (
            <div>
              {items.tasks.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea' }}>Tasks</h4>
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
                        {formatTime(task.time)} | {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {items.goals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea' }}>Goals</h4>
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
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Deadline</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {items.events.length > 0 && (
                <div>
                  <h4 style={{ color: '#667eea' }}>Events</h4>
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
      <h2 className="section-header">Calendar View</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <div className="row">
          <div className="col-6">
            <label className="form-label">View:</label>
          </div>
          <div className="col-6">
            <div style={{ display: 'flex', gap: '0.5rem' }} role="group" aria-label="Calendar view options">
              <button 
                className={`btn ${calendarView === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('month')}
                aria-pressed={calendarView === 'month'}
              >
                Month
              </button>
              <button 
                className={`btn ${calendarView === 'week' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('week')}
                aria-pressed={calendarView === 'week'}
              >
                Week
              </button>
              <button 
                className={`btn ${calendarView === 'day' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCalendarView('day')}
                aria-pressed={calendarView === 'day'}
              >
                Day
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className={calendarView === 'day' ? 'col-12' : 'col-9'}>
          <div className="card">
            {calendarView === 'month' && (
              <div className="month-view">
                <MonthView 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
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
                  setSelectedDate={setSelectedDate}
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
                  setSelectedDate={setSelectedDate}
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
          <div className="col-3">
          {selectedEvent ? (
            <div className="card">
              <h3>{selectedDate.toLocaleDateString()}</h3>
              
              {selectedEvent.tasks.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Tasks</h4>
                  {selectedEvent.tasks.map(task => (
                    <div key={task.id} style={{ 
                      padding: '0.75rem', 
                      marginBottom: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.3' }}>{task.task}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                        {formatTime(task.time)}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedEvent.goals.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Goals</h4>
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
                          Deadline
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedEvent.events.length > 0 && (
                <div>
                  <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Events</h4>
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
              <h3>{selectedDate.toLocaleDateString()}</h3>
              <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
                No items scheduled for this date.
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}><strong>Legend</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D73027', marginRight: '0.5rem' }}></div>
                  <span>High</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4575B4', marginRight: '0.5rem' }}></div>
                  <span>Medium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#91BFDB', marginRight: '0.5rem' }}></div>
                  <span>Low</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3498DB', marginRight: '0.5rem' }}></div>
                  <span>Goals</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9b59b6', marginRight: '0.5rem' }}></div>
                  <span>Events</span>
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