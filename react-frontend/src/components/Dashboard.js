import React from 'react';

const Dashboard = ({ tasks, goals, events }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;

  return (
    <div>
      <h2 className="section-header">Dashboard Overview</h2>
      
      <div className="row">
        <div className="col-3">
          <div className="metric-card">
            <div className="metric-value">{totalTasks}</div>
            <div className="metric-label">Total Tasks</div>
            <div style={{ color: '#4575B4', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {completedTasks} completed
            </div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="metric-card">
            <div className="metric-value">{totalGoals}</div>
            <div className="metric-label">Total Goals</div>
            <div style={{ color: '#4575B4', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {completedGoals} completed
            </div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="metric-card">
            <div className="metric-value">{events.length}</div>
            <div className="metric-label">Events</div>
          </div>
        </div>
        
        <div className="col-3">
          <div className="metric-card">
            <div className="metric-value">{Math.round(completionRate)}%</div>
            <div className="metric-label">Task Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;