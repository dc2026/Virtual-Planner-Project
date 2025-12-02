# Virtual Planner

A React-based web application for managing tasks, goals, and events with user authentication and data persistence.

## Features

- **User Authentication**: Secure login/registration with password reset functionality
- **Task Management**: Create, edit, and track tasks with priorities and due dates
- **Goal Tracking**: Set and monitor long-term goals with deadlines
- **Event Scheduling**: Schedule events with start/end times
- **Weekly View**: Visual calendar showing all items for the current week
- **Data Tables**: Organized view of all tasks, goals, and events
- **Calendar View**: Monthly calendar display
- **Reminders**: Smart reminder system for upcoming items
- **Data Persistence**: All data saved locally in browser storage

## How It Works

### Authentication
- Users register with username, password, and email
- Secure password hashing using CryptoJS
- Password reset with token-based verification
- User sessions maintained with localStorage

### Task Management
- Create tasks with name, date, time, and priority levels (Low/Medium/High)
- Mark tasks as complete/incomplete
- Edit existing tasks
- Delete tasks with confirmation

### Goal Management
- Set goals with descriptions and target deadlines
- Track completion status
- Edit and delete goals

### Event Management
- Schedule events with titles, start/end dates and times
- View events in weekly and calendar views
- Edit and delete events

### Data Storage
- All user data stored locally in browser localStorage
- Automatic saving when items are added/modified
- Data persists between sessions

## Technical Stack

- **Frontend**: React with functional components and hooks
- **Styling**: Custom CSS with responsive design
- **Icons**: React Icons (Feather icons)
- **Date Handling**: date-fns library
- **Notifications**: react-hot-toast
- **Security**: CryptoJS for password hashing
- **Storage**: Browser localStorage

## Project Structure

```
react-frontend/
├── src/
│   ├── components/
│   │   ├── AuthPage.js          # Login/registration
│   │   ├── Dashboard.js         # Summary statistics
│   │   ├── ItemForms.js         # Task/goal/event forms
│   │   ├── WeeklyView.js        # Weekly calendar
│   │   ├── DataTables.js        # Data management tables
│   │   ├── CalendarView.js      # Monthly calendar
│   │   └── Reminders.js         # Reminder system
│   ├── services/
│   │   └── authService.js       # Authentication logic
│   ├── App.js                   # Main application
│   └── index.css                # Styling
```

## Getting Started

1. Navigate to the react-frontend branch
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. Open http://localhost:3000 in your browser
5. Register a new account or login with existing credentials

The application runs entirely in the browser with no backend server required.