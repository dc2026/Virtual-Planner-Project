# Virtual Planner

A modern, responsive React application for managing tasks, goals, and events with an intuitive user interface.

## Features

### Authentication
- User registration and login
- Password reset functionality
- Secure local storage authentication
- User session management

### Dashboard
- Overview of tasks, goals, and events
- Completion rate tracking
- Visual metrics with equal-height cards
- Real-time progress updates

### Task Management
- Create, edit, and delete tasks
- Priority levels (High, Medium, Low)
- Date and time scheduling
- Task completion tracking

### Goal Setting
- Long-term goal creation and tracking
- Deadline management
- Goal completion status
- Progress visualization

### Event Planning
- Event creation with start/end times
- Calendar integration
- Event details management

### Calendar Views
- Month, Week, and Day views
- Interactive date selection
- Color-coded priority system
- Responsive layout adjustments

### Data Management
- Local storage persistence
- Real-time data updates
- User-specific data isolation

## Technology Stack

- **React 18** - Modern React with hooks
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Custom styling with flexbox/grid
- **Local Storage** - Client-side data persistence
- **Crypto-JS** - Password hashing and security
- **date-fns** - Date manipulation library
- **react-hot-toast** - Toast notifications
- **react-icons** - Icon library

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dc2026/Virtual-Planner-Project.git
   cd Virtual-Planner-Project
   ```

2. **Navigate to the react-frontend directory**
   ```bash
   cd react-frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
react-frontend
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── AuthPage.js          # Login/Register/Reset Password
│   │   ├── Dashboard.js         # Main dashboard with metrics
│   │   ├── ItemForms.js         # Task/Goal/Event creation forms
│   │   ├── DataTables.js        # Data display tables
│   │   ├── CalendarView.js      # Calendar with multiple views
│   │   ├── WeeklyView.js        # Weekly schedule view
│   │   └── Reminders.js         # Reminder system
│   ├── services
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
- Token-based password reset functionality
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

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Available Scripts

- `npm start` - Runs the development server
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Authors

- **Izzie Nielsen**
- **Danielle Carrol**
- **Becca Borgmeier**

## License

This project is developed for educational purposes as part of a Software Engineering course.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.