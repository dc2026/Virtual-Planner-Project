import streamlit as st
from datetime import datetime, timedelta, date, time
import pandas as pd
from streamlit_calendar import calendar as st_calendar_component
from auth import UserAuth, show_auth_page, logout_user, save_current_user_data

# --- 1. CONFIGURATION (must be first) ---
st.set_page_config(page_title="Virtual Planner", layout="wide", page_icon="📅")

# Custom CSS for better styling
st.markdown("""
<style>
    /* Main title styling */
    .main-title {
        font-size: 3rem;
        font-weight: bold;
        background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0;
    }
    
    /* Card styling */
    .stForm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    /* Button styling */
    .stButton>button {
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    /* Section headers */
    .section-header {
        font-size: 1.8rem;
        font-weight: 600;
        color: #667eea;
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #667eea;
    }
    
    /* User info badge */
    .user-badge {
        background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
    }
    
    /* Weekly calendar styling */
    .day-column {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.2rem;
        min-height: 200px;
    }
    
    /* Dataframe styling */
    .dataframe {
        border-radius: 10px;
        overflow: hidden;
    }
</style>
""", unsafe_allow_html=True)

# --- 2. CHECK AUTHENTICATION STATUS ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

if 'auth' not in st.session_state:
    st.session_state.auth = UserAuth()

# Show login page if not authenticated
if not st.session_state.logged_in:
    show_auth_page()
    st.stop()

# --- 3. INITIALIZE SESSION STATE ---
if 'tasks' not in st.session_state:
    st.session_state.tasks = []
if 'goals' not in st.session_state:
    st.session_state.goals = []
if 'events' not in st.session_state:
    st.session_state.events = []
if 'show_form' not in st.session_state:
    st.session_state.show_form = 'task'
if 'editing_id' not in st.session_state:
    st.session_state.editing_id = None
if 'editing_type' not in st.session_state:
    st.session_state.editing_type = None

# --- HEADER WITH USER INFO ---
col1, col2, col3 = st.columns([6, 3, 1])
with col1:
    st.markdown('<h1 class="main-title">📅 Virtual Planner</h1>', unsafe_allow_html=True)
with col2:
    st.markdown(f'<div class="user-badge">👤 {st.session_state.username}</div>', unsafe_allow_html=True)
with col3:
    if st.button("🚪 Logout", use_container_width=True):
        logout_user()

st.markdown("---")

# --- Helper Functions ---
def convert_date_str(date_obj):
    """Convert string to date object if needed."""
    if isinstance(date_obj, str):
        return datetime.fromisoformat(date_obj).date()
    return date_obj

def convert_time_str(time_obj):
    """Convert string to time object if needed."""
    if isinstance(time_obj, str):
        return datetime.strptime(time_obj, '%H:%M:%S').time()
    return time_obj

def get_item_by_id(item_type, item_id):
    """Retrieves an item (task, goal, or event) by its ID."""
    if item_type in st.session_state:
        found_items = [item for item in st.session_state[item_type] if item['id'] == item_id]
        if found_items:
            return found_items[0]
    return None

def generate_unique_id(item_type):
    """Generates a unique ID for new items."""
    if st.session_state[item_type]:
        return max([t['id'] for t in st.session_state[item_type]], default=-1) + 1
    return 0
    
def reset_editing():
    """Resets the editing state."""
    st.session_state.editing_id = None
    st.session_state.editing_type = None

def delete_item(item_type, item_id):
    """Deletes an item by ID and reruns."""
    if item_type in st.session_state:
        st.session_state[item_type] = [
            item for item in st.session_state[item_type] if item['id'] != item_id
        ]
    save_current_user_data()
    st.success(f"✅ {item_type.capitalize().rstrip('s')} deleted!")
    st.rerun()

# --- STATISTICS DASHBOARD ---
st.markdown('<p class="section-header">📊 Dashboard Overview</p>', unsafe_allow_html=True)

col1, col2, col3, col4 = st.columns(4)

total_tasks = len(st.session_state.tasks)
completed_tasks = len([t for t in st.session_state.tasks if t['completed']])
total_goals = len(st.session_state.goals)
completed_goals = len([g for g in st.session_state.goals if g['completed']])

with col1:
    st.metric("📝 Total Tasks", total_tasks, delta=f"{completed_tasks} completed")
with col2:
    st.metric("🎯 Total Goals", total_goals, delta=f"{completed_goals} completed")
with col3:
    st.metric("📅 Events", len(st.session_state.events))
with col4:
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    st.metric("✅ Task Completion", f"{completion_rate:.0f}%")

st.markdown("---")
    
# --- 4. INPUT SELECTION BUTTONS ---
st.markdown('<p class="section-header">➕ Add New Item</p>', unsafe_allow_html=True)

col_b1, col_b2, col_b3 = st.columns([1, 1, 1])

with col_b1:
    if st.button("📝 ADD TASK", use_container_width=True, type="primary"):
        st.session_state.show_form = 'task'
        reset_editing()
with col_b2:
    if st.button("🎯 ADD GOAL", use_container_width=True, type="primary"):
        st.session_state.show_form = 'goal'
        reset_editing()
with col_b3:
    if st.button("📅 ADD EVENT", use_container_width=True, type="primary"):
        st.session_state.show_form = 'event'
        reset_editing()

st.markdown("<br>", unsafe_allow_html=True)

# --- 5. ADD ITEM FORMS ---
if st.session_state.editing_id is None:
    if st.session_state.show_form == 'task':
        with st.form("add_task"):
            st.markdown("### 📝 Create New Task")
            col1, col2 = st.columns(2)
            with col1:
                task_name = st.text_input("Task Name *", placeholder="Enter task description...", key="add_task_name")
                task_date = st.date_input("📅 Date", key="add_task_date")
            with col2:
                task_time = st.time_input("🕐 Time", key="add_task_time")
                priority = st.selectbox("⚡ Priority", ["Low", "Medium", "High"], key="add_task_priority")
            
            col_submit, col_cancel = st.columns([1, 5])
            with col_submit:
                submitted = st.form_submit_button("➕ Add Task", use_container_width=True)

            if submitted and task_name:
                new_id = generate_unique_id('tasks')
                st.session_state.tasks.append({
                    'id': new_id,
                    'task': task_name,
                    'date': task_date,
                    'time': task_time,
                    'priority': priority,
                    'completed': False
                })
                save_current_user_data()
                st.success(f"✅ Task '{task_name}' added successfully!")
                st.rerun()

    elif st.session_state.show_form == 'goal':
        with st.form("add_goal"):
            st.markdown("### 🎯 Create New Goal")
            goal_name = st.text_input("Goal Description *", placeholder="What do you want to achieve?", key="add_goal_name")
            goal_deadline = st.date_input("📅 Deadline", key="add_goal_deadline")
            
            col_submit, col_cancel = st.columns([1, 5])
            with col_submit:
                submitted = st.form_submit_button("➕ Add Goal", use_container_width=True)
            
            if submitted and goal_name:
                new_id = generate_unique_id('goals')
                st.session_state.goals.append({
                    'id': new_id,
                    'name': goal_name, 
                    'deadline': goal_deadline, 
                    'completed': False
                })
                save_current_user_data()
                st.success(f"✅ Goal '{goal_name}' added successfully!")
                st.rerun()

    elif st.session_state.show_form == 'event':
        with st.form("add_event"):
            st.markdown("### 📅 Create New Event")
            event_title = st.text_input("Event Title *", placeholder="Enter event name...", key="add_event_title")
            
            col1, col2 = st.columns(2)
            with col1:
                st.markdown("**Start**")
                event_start_date = st.date_input("Start Date", key="add_event_start_date", label_visibility="collapsed")
                event_start_time = st.time_input("Start Time", key="add_event_start_time", label_visibility="collapsed")
            with col2:
                st.markdown("**End**")
                event_end_date = st.date_input("End Date", value=event_start_date, key="add_event_end_date", label_visibility="collapsed")
                event_end_time = st.time_input("End Time", key="add_event_end_time", label_visibility="collapsed")
            
            col_submit, col_cancel = st.columns([1, 5])
            with col_submit:
                submitted = st.form_submit_button("➕ Add Event", use_container_width=True)
            
            if submitted and event_title:
                new_id = generate_unique_id('events')
                st.session_state.events.append({
                    'id': new_id,
                    'title': event_title,
                    'start': datetime.combine(event_start_date, event_start_time).isoformat(),
                    'end': datetime.combine(event_end_date, event_end_time).isoformat(),
                })
                save_current_user_data()
                st.success(f"✅ Event '{event_title}' added successfully!")
                st.rerun()

# --- 6. EDIT ITEM FORM (CONDITIONAL) ---
if st.session_state.editing_id is not None:
    item_type = st.session_state.editing_type
    item_to_edit = get_item_by_id(item_type, st.session_state.editing_id)

    if item_to_edit:
        st.markdown(f'<p class="section-header">✏️ Editing {item_type.capitalize()}</p>', unsafe_allow_html=True)
        
        with st.form(f"edit_{item_type}"):
            if item_type == 'tasks':
                col1, col2 = st.columns(2)
                with col1:
                    new_task_name = st.text_input("Task Name", value=item_to_edit['task'], key="edit_task_name")
                    new_task_date = st.date_input("Date", value=item_to_edit['date'], key="edit_task_date")
                with col2:
                    new_task_time = st.time_input("Time", value=item_to_edit['time'], key="edit_task_time")
                    priority_options = ["Low", "Medium", "High"]
                    new_priority = st.selectbox("Priority", priority_options, index=priority_options.index(item_to_edit['priority']), key="edit_task_priority")
                new_completed = st.checkbox("✅ Mark as completed", value=item_to_edit['completed'], key="edit_task_completed")
                
            elif item_type == 'goals':
                new_goal_name = st.text_input("Goal Description", value=item_to_edit['name'], key="edit_goal_name")
                new_goal_deadline = st.date_input("Deadline", value=item_to_edit['deadline'], key="edit_goal_deadline")
                new_completed = st.checkbox("✅ Mark as completed", value=item_to_edit['completed'], key="edit_goal_completed")
                
            elif item_type == 'events':
                start_dt = datetime.fromisoformat(item_to_edit['start'])
                end_dt = datetime.fromisoformat(item_to_edit['end'])

                new_event_title = st.text_input("Event Title", value=item_to_edit['title'], key="edit_event_title")
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown("**Start**")
                    new_event_start_date = st.date_input("Start Date", value=start_dt.date(), key="edit_event_start_date", label_visibility="collapsed")
                    new_event_start_time = st.time_input("Start Time", value=start_dt.time(), key="edit_event_start_time", label_visibility="collapsed")
                with col2:
                    st.markdown("**End**")
                    new_event_end_date = st.date_input("End Date", value=end_dt.date(), key="edit_event_end_date", label_visibility="collapsed")
                    new_event_end_time = st.time_input("End Time", value=end_dt.time(), key="edit_event_end_time", label_visibility="collapsed")

            st.markdown("---")
            col_save, col_cancel = st.columns([1, 6])
            with col_save:
                save_changes = st.form_submit_button("💾 Save", use_container_width=True, type="primary")
            with col_cancel:
                cancel_edit = st.form_submit_button("❌ Cancel", use_container_width=True)

            if save_changes:
                for i, item in enumerate(st.session_state[item_type]):
                    if item['id'] == st.session_state.editing_id:
                        if item_type == 'tasks':
                            st.session_state.tasks[i].update({
                                'task': new_task_name,
                                'date': new_task_date,
                                'time': new_task_time,
                                'priority': new_priority,
                                'completed': new_completed
                            })
                        elif item_type == 'goals':
                            st.session_state.goals[i].update({
                                'name': new_goal_name,
                                'deadline': new_goal_deadline,
                                'completed': new_completed
                            })
                        elif item_type == 'events':
                            st.session_state.events[i].update({
                                'title': new_event_title,
                                'start': datetime.combine(new_event_start_date, new_event_start_time).isoformat(),
                                'end': datetime.combine(new_event_end_date, new_event_end_time).isoformat(),
                            })
                        break
                reset_editing()
                save_current_user_data()
                st.success(f"✅ {item_type.capitalize()} updated!")
                st.rerun()

            if cancel_edit:
                reset_editing()
                st.rerun()
                
st.markdown("---")

## 📅 **Weekly List View**

st.markdown('<p class="section-header">📅 This Week\'s Schedule</p>', unsafe_allow_html=True)

today = datetime.now().date()
monday = today - timedelta(days=today.weekday())
week_days = [monday + timedelta(days=i) for i in range(7)]

cols = st.columns(7)
for i, day in enumerate(week_days):
    with cols[i]:
        is_today = day == today
        day_label = "🔵 TODAY" if is_today else day.strftime('%a')
        
        if is_today:
            st.markdown(f"<div style='background: linear-gradient(120deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; border-radius: 10px; text-align: center; font-weight: bold;'>{day_label}<br>{day.strftime('%m/%d')}</div>", unsafe_allow_html=True)
        else:
            st.markdown(f"<div style='background: #f8f9fa; padding: 10px; border-radius: 10px; text-align: center; font-weight: bold;'>{day_label}<br>{day.strftime('%m/%d')}</div>", unsafe_allow_html=True)
        
        day_tasks = sorted(
            [task for task in st.session_state.tasks if convert_date_str(task['date']) == day],
            key=lambda x: convert_time_str(x['time'])
        )

        if not day_tasks:
            st.markdown("<p style='text-align: center; color: #999; padding: 20px;'>No tasks</p>", unsafe_allow_html=True)
        
        for task in day_tasks:
            priority_color = {"High": "🔴", "Medium": "🟡", "Low": "🟢"}
            checkbox_key = f"task_{task['id']}_weekly_view"
            
            task_time = convert_time_str(task['time'])

            completed = st.checkbox(
                f"{priority_color[task['priority']]} {task['task']}",
                value=task['completed'],
                key=checkbox_key
            )
            st.caption(f"🕐 {task_time.strftime('%I:%M %p')}")

            for t in st.session_state.tasks:
                if t['id'] == task['id']:
                    if t['completed'] != completed:
                        t['completed'] = completed
                        save_current_user_data()
                    break

st.markdown("---")

## 📋 **Data Management**

st.markdown('<p class="section-header">📋 Manage Your Items</p>', unsafe_allow_html=True)

# Create tabs for better organization
tab1, tab2, tab3 = st.tabs(["📝 Tasks", "🎯 Goals", "📅 Events"])

with tab1:
    if st.session_state.tasks:
        df_tasks = pd.DataFrame([{
            'ID': t['id'],
            'Task': t['task'],
            'Date': t['date'],
            'Time': t['time'],
            'Priority': t['priority'],
            'Status': '✅ Done' if t['completed'] else '⏳ Pending'
        } for t in st.session_state.tasks])
        df_tasks = df_tasks.sort_values(by=['Status', 'Date', 'Time'], ascending=[False, True, True])
        
        st.dataframe(df_tasks, use_container_width=True, hide_index=True, height=300)
        
        col_t_edit, col_t_del = st.columns([1, 1])
        with col_t_edit:
            task_id_to_edit = st.selectbox("Select task to edit:", options=df_tasks['ID'].tolist(), key='select_task_id')
            if st.button("✏️ Edit Task", key='btn_edit_task', use_container_width=True, type="primary"):
                st.session_state.editing_id = task_id_to_edit
                st.session_state.editing_type = 'tasks'
                st.rerun()
        with col_t_del:
            task_id_to_delete = st.selectbox("Select task to delete:", options=df_tasks['ID'].tolist(), key='delete_task_id')
            if st.button("🗑️ Delete Task", key='btn_delete_task', use_container_width=True):
                delete_item('tasks', task_id_to_delete)
    else:
        st.info("📝 No tasks yet. Create your first task above!")

with tab2:
    if st.session_state.goals:
        df_goals = pd.DataFrame([{
            'ID': g['id'],
            'Goal': g['name'],
            'Deadline': g['deadline'],
            'Status': '✅ Done' if g['completed'] else '⏳ In Progress'
        } for g in st.session_state.goals])
        
        st.dataframe(df_goals, use_container_width=True, hide_index=True, height=300)

        col_g_edit, col_g_del = st.columns([1, 1])
        with col_g_edit:
            goal_id_to_edit = st.selectbox("Select goal to edit:", options=df_goals['ID'].tolist(), key='select_goal_id')
            if st.button("✏️ Edit Goal", key='btn_edit_goal', use_container_width=True, type="primary"):
                st.session_state.editing_id = goal_id_to_edit
                st.session_state.editing_type = 'goals'
                st.rerun()
        with col_g_del:
            goal_id_to_delete = st.selectbox("Select goal to delete:", options=df_goals['ID'].tolist(), key='delete_goal_id')
            if st.button("🗑️ Delete Goal", key='btn_delete_goal', use_container_width=True):
                delete_item('goals', goal_id_to_delete)
    else:
        st.info("🎯 No goals yet. Set your first goal above!")

with tab3:
    if st.session_state.events:
        df_events = pd.DataFrame([{
            'ID': e['id'],
            'Title': e['title'],
            'Start': datetime.fromisoformat(e['start']).strftime('%Y-%m-%d %I:%M %p'),
            'End': datetime.fromisoformat(e['end']).strftime('%Y-%m-%d %I:%M %p')
        } for e in st.session_state.events])
        
        st.dataframe(df_events, use_container_width=True, hide_index=True, height=300)
        
        col_e_edit, col_e_del = st.columns([1, 1])
        with col_e_edit:
            event_id_to_edit = st.selectbox("Select event to edit:", options=df_events['ID'].tolist(), key='select_event_id')
            if st.button("✏️ Edit Event", key='btn_edit_event', use_container_width=True, type="primary"):
                st.session_state.editing_id = event_id_to_edit
                st.session_state.editing_type = 'events'
                st.rerun()
        with col_e_del:
            event_id_to_delete = st.selectbox("Select event to delete:", options=df_events['ID'].tolist(), key='delete_event_id')
            if st.button("🗑️ Delete Event", key='btn_delete_event', use_container_width=True):
                delete_item('events', event_id_to_delete)
    else:
        st.info("📅 No events yet. Schedule your first event above!")

st.markdown("---")

## 🗓️ **Interactive Calendar View**

st.markdown('<p class="section-header">🗓️ Calendar View</p>', unsafe_allow_html=True)

calendar_events = []
priority_colors = {"High": "#FF4B4B", "Medium": "#FFC000", "Low": "#4BCB58"} 
goal_color = "#3498DB"

for task in st.session_state.tasks:
    if not task['completed']:
        task_date = convert_date_str(task['date'])
        task_time = convert_time_str(task['time'])
        task_datetime = datetime.combine(task_date, task_time)
        calendar_events.append({
            'title': f"📝 {task['task']} ({task['priority']})",
            'start': task_datetime.isoformat(),
            'color': priority_colors[task['priority']],
            'id': f"task-{task['id']}", 
            'extendedProps': {'type': 'task', 'item_id': task['id']}
        })

for goal in st.session_state.goals:
    if not goal['completed']:
        goal_date = convert_date_str(goal['deadline'])
        calendar_events.append({
            'title': f"🎯 {goal['name']}",
            'start': goal_date.isoformat(), 
            'allDay': True,
            'color': goal_color,
            'id': f"goal-{goal['id']}", 
            'extendedProps': {'type': 'goal', 'item_id': goal['id']}
        })

for event in st.session_state.events:
    calendar_events.append({
        'title': f"📅 {event['title']}",
        'start': event['start'],
        'end': event['end'],
        'color': '#9b59b6',
        'id': f"event-{event['id']}", 
        'extendedProps': {'type': 'event', 'item_id': event['id']}
    })

calendar_options = {
    "initialView": "dayGridMonth",
    "headerToolbar": {
        "left": "today prev,next",
        "center": "title",
        "right": "dayGridMonth,timeGridWeek,timeGridDay"
    },
    "editable": False, 
    "selectable": True,
    "height": 650,
}

calendar_result = st_calendar_component( 
    events=calendar_events,
    options=calendar_options,
    custom_css="""
        .fc-event-title {
            color: #FFFFFF !important;
            font-weight: bold;
        }
        .fc {
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    """,
    key='full_calendar'
)

if calendar_result.get("eventClick"):
    clicked_event = calendar_result["eventClick"]["event"]
    
    item_type = clicked_event['extendedProps']['type']
    item_id = clicked_event['extendedProps']['item_id']
    
    item_details = get_item_by_id(item_type + 's', item_id)
    
    if item_details:
        st.markdown(f'<p class="section-header">ℹ️ {item_type.capitalize()} Details</p>', unsafe_allow_html=True)
        
        if item_type == 'task':
            col1, col2 = st.columns(2)
            with col1:
                st.write(f"**📝 Task:** {item_details['task']}")
                st.write(f"**📅 Date:** {item_details['date']}")
            with col2:
                st.write(f"**🕐 Time:** {item_details['time']}")
                st.write(f"**⚡ Priority:** {item_details['priority']}")
                st.write(f"**Status:** {'✅ Completed' if item_details['completed'] else '⏳ Pending'}")
        elif item_type == 'event':
            st.write(f"**📅 Event:** {item_details['title']}")
            st.write(f"**⏰ Start:** {datetime.fromisoformat(item_details['start']).strftime('%Y-%m-%d %I:%M %p')}")
            st.write(f"**⏰ End:** {datetime.fromisoformat(item_details['end']).strftime('%Y-%m-%d %I:%M %p')}")
        elif item_type == 'goal':
            st.write(f"**🎯 Goal:** {item_details['name']}")
            st.write(f"**📅 Deadline:** {item_details['deadline']}")
            st.write(f"**Status:** {'✅ Completed' if item_details['completed'] else '⏳ In Progress'}")