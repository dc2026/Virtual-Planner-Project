import CryptoJS from 'crypto-js';

class AuthService {
  constructor() {
    this.users = this.loadUsers();
  }

  loadUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
  }

  saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
    this.users = users;
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
    return localStorage.getItem('currentUser');
  }

  setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}

export default new AuthService();