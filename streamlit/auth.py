import streamlit as st
import hashlib
import json
from pathlib import Path
from datetime import datetime

# --- USER AUTHENTICATION & DATA STORAGE ---

class UserAuth:
    """Handles user authentication and data persistence."""
    
    def __init__(self, data_dir="user_data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.users_file = self.data_dir / "users.json"
        self._init_users_file()
    
    def _init_users_file(self):
        """Initialize users file if it doesn't exist."""
        if not self.users_file.exists():
            self.users_file.write_text(json.dumps({}))
    
    def _load_users(self):
        """Load all users from file."""
        try:
            return json.loads(self.users_file.read_text())
        except:
            return {}
    
    def _save_users(self, users):
        """Save all users to file."""
        self.users_file.write_text(json.dumps(users, indent=2))
    
    def _hash_password(self, password):
        """Hash password using SHA-256."""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def register_user(self, username, password, email):
        """Register a new user."""
        users = self._load_users()
        
        if username in users:
            return False, "Username already exists"
        
        users[username] = {
            "password": self._hash_password(password),
            "email": email
        }
        self._save_users(users)
        
        # Create user data file
        user_data_file = self.data_dir / f"{username}_data.json"
        user_data_file.write_text(json.dumps({
            "tasks": [],
            "goals": [],
            "events": []
        }))
        
        return True, "Registration successful!"
    
    def login_user(self, username, password):
        """Authenticate user login."""
        users = self._load_users()
        
        if username not in users:
            return False, "Username not found"
        
        if users[username]["password"] != self._hash_password(password):
            return False, "Incorrect password"
        
        return True, "Login successful!"
    
    def load_user_data(self, username):
        """Load user's planner data."""
        user_data_file = self.data_dir / f"{username}_data.json"
        
        try:
            if user_data_file.exists():
                data = json.loads(user_data_file.read_text())
                
                # Convert string dates/times back to proper objects
                for task in data.get('tasks', []):
                    if 'date' in task and isinstance(task['date'], str):
                        task['date'] = datetime.fromisoformat(task['date']).date()
                    if 'time' in task and isinstance(task['time'], str):
                        task['time'] = datetime.strptime(task['time'], '%H:%M:%S').time()
                
                for goal in data.get('goals', []):
                    if 'deadline' in goal and isinstance(goal['deadline'], str):
                        goal['deadline'] = datetime.fromisoformat(goal['deadline']).date()
                
                return data
        except Exception as e:
            st.error(f"Error loading user data: {e}")
        
        # Return empty data structure if file doesn't exist or error
        return {"tasks": [], "goals": [], "events": []}
    
    def save_user_data(self, username, data):
        """Save user's planner data."""
        try:
            user_data_file = self.data_dir / f"{username}_data.json"
            user_data_file.write_text(json.dumps(data, indent=2, default=str))
        except Exception as e:
            st.error(f"Error saving user data: {e}")


# --- STREAMLIT UI FOR AUTH ---

def show_auth_page():
    """Display login/signup page."""
    # Initialize auth object
    if 'auth' not in st.session_state:
        st.session_state.auth = UserAuth()
    
    # Custom CSS for auth page
    st.markdown("""
    <style>
        .auth-title {
            font-size: 4rem;
            font-weight: bold;
            background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 0.5rem;
        }
        .auth-subtitle {
            text-align: center;
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        .stTabs [data-baseweb="tab-list"] {
            gap: 2rem;
            justify-content: center;
        }
        .stTabs [data-baseweb="tab"] {
            font-size: 1.2rem;
            font-weight: 600;
            padding: 1rem 2rem;
        }
    </style>
    """, unsafe_allow_html=True)
    
    st.markdown('<h1 class="auth-title">📅 Virtual Planner</h1>', unsafe_allow_html=True)
    st.markdown('<p class="auth-subtitle">✨ Organize your life, one task at a time</p>', unsafe_allow_html=True)
    
    # Create tabs for Login and Signup
    tab1, tab2 = st.tabs(["🔐 Login", "📝 Sign Up"])
    
    # --- LOGIN TAB ---
    with tab1:
        with st.form("login_form"):
            st.markdown("### Login to Your Account")
            login_username = st.text_input("Username", key="login_user")
            login_password = st.text_input("Password", type="password", key="login_pass")
            login_button = st.form_submit_button("Login", use_container_width=True)
            
            if login_button:
                if login_username and login_password:
                    success, message = st.session_state.auth.login_user(
                        login_username, 
                        login_password
                    )
                    
                    if success:
                        st.session_state.logged_in = True
                        st.session_state.username = login_username
                        
                        # Load user data into session state
                        user_data = st.session_state.auth.load_user_data(login_username)
                        st.session_state.tasks = user_data.get("tasks", [])
                        st.session_state.goals = user_data.get("goals", [])
                        st.session_state.events = user_data.get("events", [])
                        
                        st.success(message)
                        st.rerun()
                    else:
                        st.error(message)
                else:
                    st.warning("Please fill in all fields")
    
    # --- SIGNUP TAB ---
    with tab2:
        with st.form("signup_form"):
            st.markdown("### Create New Account")
            signup_username = st.text_input("Username", key="signup_user")
            signup_email = st.text_input("Email", key="signup_email")
            signup_password = st.text_input("Password", type="password", key="signup_pass")
            signup_password_confirm = st.text_input(
                "Confirm Password", 
                type="password", 
                key="signup_pass_confirm"
            )
            signup_button = st.form_submit_button("Sign Up", use_container_width=True)
            
            if signup_button:
                if signup_username and signup_email and signup_password:
                    if signup_password != signup_password_confirm:
                        st.error("Passwords do not match!")
                    elif len(signup_password) < 6:
                        st.error("Password must be at least 6 characters long")
                    else:
                        success, message = st.session_state.auth.register_user(
                            signup_username,
                            signup_password,
                            signup_email
                        )
                        
                        if success:
                            st.success(message + " Please login with your credentials.")
                        else:
                            st.error(message)
                else:
                    st.warning("Please fill in all fields")


def logout_user():
    """Handle user logout."""
    if 'username' in st.session_state and 'auth' in st.session_state:
        # Save current data before logout
        try:
            user_data = {
                "tasks": st.session_state.get('tasks', []),
                "goals": st.session_state.get('goals', []),
                "events": st.session_state.get('events', [])
            }
            st.session_state.auth.save_user_data(st.session_state.username, user_data)
        except Exception as e:
            st.error(f"Error saving data on logout: {e}")
    
    # Clear session state
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    
    st.rerun()


def save_current_user_data():
    """Save current user's data to file."""
    if st.session_state.get('logged_in', False) and 'username' in st.session_state:
        try:
            user_data = {
                "tasks": st.session_state.get('tasks', []),
                "goals": st.session_state.get('goals', []),
                "events": st.session_state.get('events', [])
            }
            st.session_state.auth.save_user_data(st.session_state.username, user_data)
        except Exception as e:
            st.error(f"Error saving data: {e}")