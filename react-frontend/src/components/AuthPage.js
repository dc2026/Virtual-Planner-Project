import React, { useState } from 'react';
import authService from '../services/authService';

const AuthPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [resetData, setResetData] = useState({
    username: '',
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [resetStep, setResetStep] = useState('request'); // 'request' or 'reset'
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Clear message when switching tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage('');
    setMessageType('');
    setResetStep('request');
    setResetData({ username: '', email: '', token: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      setMessage('Please fill in all fields');
      setMessageType('warning');
      return;
    }

    const result = authService.loginUser(loginData.username, loginData.password);
    
    if (result.success) {
      authService.setCurrentUser(loginData.username);
      const userData = authService.loadUserData(loginData.username);
      onLogin(loginData.username, userData);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!signupData.username || !signupData.email || !signupData.password) {
      setMessage('Please fill in all fields');
      setMessageType('warning');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }

    if (signupData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    const result = authService.registerUser(
      signupData.username,
      signupData.password,
      signupData.email
    );

    if (result.success) {
      setMessage(result.message + ' Please login with your credentials.');
      setMessageType('success');
      setActiveTab('login');
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handlePasswordResetRequest = (e) => {
    e.preventDefault();
    
    if (!resetData.username || !resetData.email) {
      setMessage('Please fill in username and email');
      setMessageType('warning');
      return;
    }

    const result = authService.requestPasswordReset(resetData.username, resetData.email);

    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setResetStep('reset');
      // Auto-fill token for demo purposes
      setResetData(prev => ({ ...prev, token: result.token }));
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (!resetData.token || !resetData.newPassword || !resetData.confirmPassword) {
      setMessage('Please fill in all fields');
      setMessageType('warning');
      return;
    }

    if (resetData.newPassword !== resetData.confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }

    if (resetData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    const result = authService.resetPassword(
      resetData.username,
      resetData.token,
      resetData.newPassword
    );

    if (result.success) {
      setMessage(result.message + ' You can now login with your new password.');
      setMessageType('success');
      setActiveTab('login');
      setResetData({ username: '', email: '', token: '', newPassword: '', confirmPassword: '' });
      setResetStep('request');
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '0 auto', paddingTop: '2rem' }}>
        <h1 className="auth-title">Virtual Planner</h1>
        <p className="auth-subtitle">Organize your life, one task at a time</p>
        
        <div className="card">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
            <button 
              className={`tab ${activeTab === 'reset' ? 'active' : ''}`}
              onClick={() => switchTab('reset')}
            >
              Reset Password
            </button>
          </div>

          {message && (
            <div className={`alert alert-${messageType}`} style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              backgroundColor: messageType === 'success' ? '#d4edda' : 
                             messageType === 'error' ? '#f8d7da' : '#fff3cd',
              color: messageType === 'success' ? '#155724' : 
                     messageType === 'error' ? '#721c24' : '#856404',
              border: `1px solid ${messageType === 'success' ? '#c3e6cb' : 
                                  messageType === 'error' ? '#f5c6cb' : '#ffeaa7'}`
            }}>
              {message}
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Login to Your Account</h3>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Login
              </button>
              <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666'}}>
                Forgot your password? 
                <button 
                  type="button" 
                  onClick={() => switchTab('reset')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '0',
                    marginLeft: '4px'
                  }}
                >
                  Reset it here
                </button>
              </p>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={handleSignup}>
              <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Create New Account</h3>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={signupData.username}
                  onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                  placeholder="Choose a username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  placeholder="Create a password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Sign Up
              </button>
            </form>
          )}

          {activeTab === 'reset' && resetStep === 'request' && (
            <form onSubmit={handlePasswordResetRequest}>
              <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Request Password Reset</h3>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={resetData.username}
                  onChange={(e) => setResetData({...resetData, username: e.target.value})}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={resetData.email}
                  onChange={(e) => setResetData({...resetData, email: e.target.value})}
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Request Reset Token
              </button>
            </form>
          )}

          {activeTab === 'reset' && resetStep === 'reset' && (
            <form onSubmit={handlePasswordReset}>
              <h3 style={{marginBottom: '1.5rem', textAlign: 'center', color: '#2c3e50'}}>Reset Your Password</h3>
              <div className="form-group">
                <label className="form-label">Reset Token</label>
                <input
                  type="text"
                  className="form-control"
                  value={resetData.token}
                  onChange={(e) => setResetData({...resetData, token: e.target.value})}
                  placeholder="Enter reset token from console"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={resetData.confirmPassword}
                  onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Reset Password
              </button>
              <button 
                type="button" 
                onClick={() => setResetStep('request')}
                className="btn btn-secondary" 
                style={{width: '100%', marginTop: '0.5rem'}}
              >
                Back to Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;