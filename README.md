# Virtual Planner

A modern, responsive React application for managing tasks, goals, and events with an intuitive user interface.

## Features

### 🔐 Authentication
- User registration and login
- Password reset functionality
- Secure local storage authentication
- User session management

### 📊 Dashboard
- Overview of tasks, goals, and events
- Completion rate tracking
- Visual metrics with equal-height cards
- Real-time progress updates

### 📝 Task Management
- Create, edit, and delete tasks
- Priority levels (High, Medium, Low)
- Date and time scheduling
- Task completion tracking

### 🎯 Goal Setting
- Long-term goal creation and tracking
- Deadline management
- Goal completion status
- Progress visualization

### 📅 Event Planning
- Event creation with start/end times
- Calendar integration
- Event details management

### 🗓️ Calendar Views
- Month, Week, and Day views
- Interactive date selection
- Color-coded priority system
- Responsive layout adjustments

### 📋 Data Management
- Local storage persistence
- Real-time data updates
- Import/export functionality
- User-specific data isolation

## Technology Stack

- **React 18** - Modern React with hooks
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Custom styling with flexbox/grid
- **Local Storage** - Client-side data persistence
- **Crypto-JS** - Password hashing and security

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

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

4. Open your browser to `http://localhost:3000` (or `http://localhost:3001` if configured)

### Available Scripts

- `npm start` - Runs the development server
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Project Structure

```
react-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AuthPage.js          # Login/Register/Reset Password
│   │   ├── Dashboard.js         # Main dashboard with metrics
│   │   ├── ItemForms.js         # Task/Goal/Event creation forms
│   │   ├── DataTables.js        # Data display tables
│   │   ├── CalendarView.js      # Calendar with multiple views
│   │   └── WeeklyView.js        # Weekly schedule view
│   ├── services/
│   │   └── authService.js       # Authentication logic
│   ├── App.js                   # Main application component
│   ├── index.js                 # Application entry point
│   └── index.css                # Global styles
├── package.json
└── README.md
```

## Features in Detail

### Authentication System
- Secure user registration with email validation
- Password hashing using SHA-256
- "Forgot Password" functionality with email verification
- Persistent login sessions

### Responsive Design
- Mobile-first approach
- Flexible grid system
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### Visual Design
- Modern glass-morphism effects
- Consistent color scheme
- Smooth animations and transitions
- Intuitive iconography

### Data Persistence
- All user data stored locally
- Automatic save functionality
- Data isolation between users
- Backup and restore capabilities

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Create a feature branch from `react-frontend`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Authors

- Izzie Nielsen
- Danielle Carrol
- Becca Borgmeier

## License

This project is developed for educational purposes as part of a Software Engineering course.