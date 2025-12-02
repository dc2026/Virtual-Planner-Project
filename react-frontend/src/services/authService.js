import CryptoJS from 'crypto-js';

class AuthService {
  constructor() {
    this.users = this.loadUsers();
  }

  loadUsers() {
    try {
      const users = localStorage.getItem('users');
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem('users', JSON.stringify(users));
      this.users = users;
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Failed to save user data');
    }
  }

  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  registerUser(username, password, email) {
    if (this.users[username]) {
      return { success: false, message: 'Username already exists' };
    }

    this.users[username] = {
      password: this.hashPassword(password),
      email: email
    };

    this.saveUsers(this.users);

    // Create empty user data
    const userData = {
      tasks: [],
      goals: [],
      events: []
    };
    localStorage.setItem(`${username}_data`, JSON.stringify(userData));

    return { success: true, message: 'Registration successful!' };
  }

  loginUser(username, password) {
    if (!this.users[username]) {
      return { success: false, message: 'Username not found' };
    }

    if (this.users[username].password !== this.hashPassword(password)) {
      return { success: false, message: 'Incorrect password' };
    }

    return { success: true, message: 'Login successful!' };
  }

  loadUserData(username) {
    try {
      const userData = localStorage.getItem(`${username}_data`);
      if (userData) {
        const data = JSON.parse(userData);
        
        // Convert date strings back to Date objects
        data.tasks?.forEach(task => {
          if (task.date && typeof task.date === 'string') {
            task.date = task.date;
          }
          if (task.time && typeof task.time === 'string') {
            task.time = task.time;
          }
        });

        data.goals?.forEach(goal => {
          if (goal.deadline && typeof goal.deadline === 'string') {
            goal.deadline = goal.deadline;
          }
        });

        return data;
      }

      return { tasks: [], goals: [], events: [] };
    } catch (error) {
      console.error('Error loading user data:', error);
      return { tasks: [], goals: [], events: [] };
    }
  }

  saveUserData(username, data) {
    try {
      localStorage.setItem(`${username}_data`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  getCurrentUser() {
    try {
      return localStorage.getItem('currentUser');
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  setCurrentUser(username) {
    try {
      localStorage.setItem('currentUser', username);
    } catch (error) {
      console.error('Error setting current user:', error);
      throw new Error('Failed to set current user');
    }
  }

  logout() {
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  requestPasswordReset(username, email) {
    if (!this.users[username]) {
      return { success: false, message: 'Username not found' };
    }

    if (this.users[username].email !== email) {
      return { success: false, message: 'Email does not match our records' };
    }

    const resetToken = this.generateResetToken();
    const resetExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    
    this.users[username].resetToken = resetToken;
    this.users[username].resetExpiry = resetExpiry;
    this.saveUsers(this.users);

    // In a real app, this would send an email with the token
    console.log(`Password reset token for ${username}: ${resetToken}`);
    
    return { 
      success: true, 
      message: 'Password reset token generated. Check console for token (in production, this would be emailed).',
      token: resetToken // Only for demo purposes
    };
  }

  resetPassword(username, token, newPassword) {
    if (!this.users[username]) {
      return { success: false, message: 'Username not found' };
    }

    if (!this.users[username].resetToken || this.users[username].resetToken !== token) {
      return { success: false, message: 'Invalid reset token' };
    }

    if (Date.now() > this.users[username].resetExpiry) {
      delete this.users[username].resetToken;
      delete this.users[username].resetExpiry;
      this.saveUsers(this.users);
      return { success: false, message: 'Reset token has expired' };
    }

    this.users[username].password = this.hashPassword(newPassword);
    delete this.users[username].resetToken;
    delete this.users[username].resetExpiry;
    this.saveUsers(this.users);

    return { success: true, message: 'Password reset successful!' };
  }
}

export default new AuthService();