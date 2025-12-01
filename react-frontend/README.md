# Virtual Planner - React Frontend

This is the React.js frontend for the Virtual Planner application, converted from the original Streamlit implementation.

## Features

- **User Authentication**: Login and registration system with password hashing
- **Task Management**: Create, edit, delete, and track tasks with priorities and due dates
- **Goal Setting**: Set long-term goals with deadlines
- **Event Scheduling**: Schedule events with start and end times
- **Dashboard**: Overview of tasks, goals, and completion statistics
- **Weekly View**: See tasks organized by day of the week
- **Data Persistence**: All data is stored in browser localStorage

## Installation

1. Navigate to the react-frontend directory:
   ```bash
   cd react-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AuthPage.js          # Login/Registration page
│   │   ├── Dashboard.js         # Statistics dashboard
│   │   ├── DataTables.js        # Data management tables
│   │   ├── ItemForms.js         # Forms for adding/editing items
│   │   └── WeeklyView.js        # Weekly calendar view
│   ├── services/
│   │   └── authService.js       # Authentication and data services
│   ├── App.js                   # Main application component
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── package.json
└── README.md
```

## Key Components

### AuthPage
- Handles user login and registration
- Form validation and error handling
- Password hashing using crypto-js

### Dashboard
- Displays key metrics (total tasks, completed tasks, goals, etc.)
- Completion rate calculation

### ItemForms
- Dynamic forms for creating and editing tasks, goals, and events
- Form validation and data handling

### WeeklyView
- Shows tasks organized by day of the week
- Interactive checkboxes to mark tasks as complete
- Priority indicators with color coding

### DataTables
- Tabbed interface for managing tasks, goals, and events
- Edit and delete functionality
- Sorting and status indicators

## Data Storage

The application uses browser localStorage for data persistence:
- User credentials are stored in `users` key
- Individual user data is stored in `{username}_data` keys
- Data includes tasks, goals, and events arrays

## Styling

The application uses custom CSS that replicates the original Streamlit design:
- Gradient backgrounds and modern card layouts
- Responsive design for mobile devices
- Color-coded priority and status indicators
- Smooth transitions and hover effects

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (one-way operation)

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- localStorage API
- CSS Grid and Flexbox

## Future Enhancements

- Calendar integration with external services
- Data export/import functionality
- Real-time collaboration features
- Mobile app version
- Backend API integration