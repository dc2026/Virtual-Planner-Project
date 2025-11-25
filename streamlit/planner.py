import streamlit as st
from datetime import datetime, timedelta
import pandas as pd
from streamlit_calendar import calendar as st_calendar_component

# --- 1. CONFIGURATION ---
st.set_page_config(page_title="Virtual Planner", layout="wide")

# --- 2. INITIALIZE SESSION STATE ---
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

st.title("📅 Virtual Planner")

# --- Helper Functions ---
def get_item_by_id(item_type, item_id):
    """Retrieves an item (task, goal, or event) by its ID."""
    if item_type in st.session_state:
        # Use a list comprehension to find the item
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
    st.success(f"{item_type.capitalize().rstrip('s')} ID {item_id} deleted.")
    st.rerun()
    
# --- 3. INPUT SELECTION BUTTONS ---
st.subheader("Add New Item")
col_b1, col_b2, col_b3 = st.columns([1, 1, 1])

with col_b1:
    if st.button("TASK", use_container_width=True):
        st.session_state.show_form = 'task'
        reset_editing()
with col_b2:
    if st.button("GOAL", use_container_width=True):
        st.session_state.show_form = 'goal'
        reset_editing()
with col_b3:
    if st.button("EVENT", use_container_width=True):
        st.session_state.show_form = 'event'
        reset_editing()

# --- 4. ADD ITEM FORMS ---
if st.session_state.editing_id is None:
    if st.session_state.show_form == 'task':
        with st.form("add_task"):
            st.write("### 📝 Add New Task")
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                task_name = st.text_input("Task Name", key="add_task_name")
            with col2:
                task_date = st.date_input("Date", key="add_task_date")
            with col3:
                task_time = st.time_input("Time", key="add_task_time")
            with col4:
                priority = st.selectbox("Priority", ["Low", "Medium", "High"], key="add_task_priority")
            submitted = st.form_submit_button("Add Task")

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
                st.success(f"Task '{task_name}' added! (ID: {new_id})")
                # Removed st.rerun() - Streamlit often updates automatically on form submit

    elif st.session_state.show_form == 'goal':
        with st.form("add_goal"):
            st.write("### 🎯 Add New Goal")
            goal_name = st.text_input("Goal Description", key="add_goal_name")
            goal_deadline = st.date_input("Deadline", key="add_goal_deadline")
            submitted = st.form_submit_button("Add Goal")
            if submitted and goal_name:
                new_id = generate_unique_id('goals')
                st.session_state.goals.append({
                    'id': new_id,
                    'name': goal_name, 
                    'deadline': goal_deadline, 
                    'completed': False
                })
                st.success(f"Goal '{goal_name}' added! (ID: {new_id})")
                # Removed st.rerun()

    elif st.session_state.show_form == 'event':
        with st.form("add_event"):
            st.write("### 📢 Add New Event")
            event_title = st.text_input("Event Title", key="add_event_title")
            event_start_date = st.date_input("Start Date", key="add_event_start_date")
            event_start_time = st.time_input("Start Time", key="add_event_start_time")
            event_end_date = st.date_input("End Date", value=event_start_date, key="add_event_end_date")
            event_end_time = st.time_input("End Time", key="add_event_end_time")
            submitted = st.form_submit_button("Add Event")
            if submitted and event_title:
                new_id = generate_unique_id('events')
                st.session_state.events.append({
                    'id': new_id,
                    'title': event_title,
                    'start': datetime.combine(event_start_date, event_start_time).isoformat(),
                    'end': datetime.combine(event_end_date, event_end_time).isoformat(),
                })
                st.success(f"Event '{event_title}' added! (ID: {new_id})")
                # Removed st.rerun()

# --- 5. EDIT ITEM FORM (CONDITIONAL) ---
if st.session_state.editing_id is not None:
    item_type = st.session_state.editing_type
    item_to_edit = get_item_by_id(item_type, st.session_state.editing_id)

    if item_to_edit:
        st.subheader(f"✏️ Editing {item_type.capitalize()}: {item_to_edit.get('task', item_to_edit.get('name', item_to_edit.get('title')))}")
        
        with st.form(f"edit_{item_type}"):
            # --- TASK EDIT FORM ---
            if item_type == 'tasks':
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    new_task_name = st.text_input("Task Name", value=item_to_edit['task'], key="edit_task_name")
                with col2:
                    new_task_date = st.date_input("Date", value=item_to_edit['date'], key="edit_task_date")
                with col3:
                    new_task_time = st.time_input("Time", value=item_to_edit['time'], key="edit_task_time")
                with col4:
                    priority_options = ["Low", "Medium", "High"]
                    new_priority = st.selectbox("Priority", priority_options, index=priority_options.index(item_to_edit['priority']), key="edit_task_priority")
                new_completed = st.checkbox("Completed", value=item_to_edit['completed'], key="edit_task_completed")
                
            # --- GOAL EDIT FORM ---
            elif item_type == 'goals':
                new_goal_name = st.text_input("Goal Description", value=item_to_edit['name'], key="edit_goal_name")
                new_goal_deadline = st.date_input("Deadline", value=item_to_edit['deadline'], key="edit_goal_deadline")
                new_completed = st.checkbox("Completed", value=item_to_edit['completed'], key="edit_goal_completed")
                
            # --- EVENT EDIT FORM ---
            elif item_type == 'events':
                start_dt = datetime.fromisoformat(item_to_edit['start'])
                end_dt = datetime.fromisoformat(item_to_edit['end'])

                new_event_title = st.text_input("Event Title", value=item_to_edit['title'], key="edit_event_title")
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    new_event_start_date = st.date_input("Start Date", value=start_dt.date(), key="edit_event_start_date")
                with col2:
                    new_event_start_time = st.time_input("Start Time", value=start_dt.time(), key="edit_event_start_time")
                with col3:
                    new_event_end_date = st.date_input("End Date", value=end_dt.date(), key="edit_event_end_date")
                with col4:
                    new_event_end_time = st.time_input("End Time", value=end_dt.time(), key="edit_event_end_time")

            # --- SUBMISSION BUTTONS ---
            st.markdown("---")
            col_save, col_cancel = st.columns([1, 6])
            with col_save:
                save_changes = st.form_submit_button("Save Changes")
            with col_cancel:
                cancel_edit = st.form_submit_button("Cancel")

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
                st.success(f"{item_type.capitalize()} updated!")
                st.rerun()

            if cancel_edit:
                reset_editing()
                st.rerun()
                
st.markdown("---")

## 📅 **Weekly List View**

st.subheader("This Week's Tasks")
# Get week days
today = datetime.now().date()
monday = today - timedelta(days=today.weekday())
week_days = [monday + timedelta(days=i) for i in range(7)]

# Display calendar
cols = st.columns(7)
for i, day in enumerate(week_days):
    with cols[i]:
        st.write(f"**{day.strftime('%a %m/%d')}**")

        # Filter and sort tasks for this day
        day_tasks = sorted(
            [task for task in st.session_state.tasks if task['date'] == day],
            key=lambda x: x['time']
        )

        for task in day_tasks:
            priority_color = {"High": "🔴", "Medium": "🟡", "Low": "🟢"}
            checkbox_key = f"task_{task['id']}_weekly_view"

            # Checkbox for completion
            completed = st.checkbox(
                f"{priority_color[task['priority']]} {task['task']} - {task['time'].strftime('%I:%M %p')}",
                value=task['completed'],
                key=checkbox_key
            )

            # Update task completion status
            for t in st.session_state.tasks:
                if t['id'] == task['id']:
                    t['completed'] = completed
                    break

st.markdown("---")

## 📋 **Data Tables & Editing/Deleting Interface**

st.subheader("Data Management")

# --- Task Table ---
if st.session_state.tasks:
    st.markdown("#### Tasks")
    df_tasks = pd.DataFrame([{
        'ID': t['id'],
        'Task': t['task'],
        'Date': t['date'],
        'Time': t['time'],
        'Priority': t['priority'],
        'Completed': t['completed']
    } for t in st.session_state.tasks])
    df_tasks = df_tasks.sort_values(by=['Completed', 'Date', 'Time'], ascending=[True, True, True])
    st.dataframe(df_tasks, use_container_width=True, hide_index=True)
    
    col_t_edit, col_t_del, _ = st.columns([1, 1, 6])
    with col_t_edit:
        task_id_to_edit = st.selectbox("Edit Task ID:", options=df_tasks['ID'].tolist(), key='select_task_id', label_visibility="collapsed")
        if st.button("Edit Task", key='btn_edit_task', use_container_width=True):
            st.session_state.editing_id = task_id_to_edit
            st.session_state.editing_type = 'tasks'
            st.rerun()
    with col_t_del:
        task_id_to_delete = st.selectbox("Delete Task ID:", options=df_tasks['ID'].tolist(), key='delete_task_id', label_visibility="collapsed")
        if st.button("Delete Task", key='btn_delete_task', use_container_width=True):
            delete_item('tasks', task_id_to_delete) # Call helper function

# --- Goal Table ---
if st.session_state.goals:
    st.markdown("#### Goals")
    df_goals = pd.DataFrame([{
        'ID': g['id'],
        'Goal': g['name'],
        'Deadline': g['deadline'],
        'Completed': g['completed']
    } for g in st.session_state.goals])
    st.dataframe(df_goals, use_container_width=True, hide_index=True)

    col_g_edit, col_g_del, _ = st.columns([1, 1, 6])
    with col_g_edit:
        goal_id_to_edit = st.selectbox("Edit Goal ID:", options=df_goals['ID'].tolist(), key='select_goal_id', label_visibility="collapsed")
        if st.button("Edit Goal", key='btn_edit_goal', use_container_width=True):
            st.session_state.editing_id = goal_id_to_edit
            st.session_state.editing_type = 'goals'
            st.rerun()
    with col_g_del:
        goal_id_to_delete = st.selectbox("Delete Goal ID:", options=df_goals['ID'].tolist(), key='delete_goal_id', label_visibility="collapsed")
        if st.button("Delete Goal", key='btn_delete_goal', use_container_width=True):
            delete_item('goals', goal_id_to_delete)

# --- Event Table ---
if st.session_state.events:
    st.markdown("#### Events")
    df_events = pd.DataFrame([{
        'ID': e['id'],
        'Title': e['title'],
        'Start': datetime.fromisoformat(e['start']).strftime('%Y-%m-%d %H:%M'),
        'End': datetime.fromisoformat(e['end']).strftime('%Y-%m-%d %H:%M')
    } for e in st.session_state.events])
    st.dataframe(df_events, use_container_width=True, hide_index=True)
    
    col_e_edit, col_e_del, _ = st.columns([1, 1, 6])
    with col_e_edit:
        event_id_to_edit = st.selectbox("Edit Event ID:", options=df_events['ID'].tolist(), key='select_event_id', label_visibility="collapsed")
        if st.button("Edit Event", key='btn_edit_event', use_container_width=True):
            st.session_state.editing_id = event_id_to_edit
            st.session_state.editing_type = 'events'
            st.rerun()
    with col_e_del:
        event_id_to_delete = st.selectbox("Delete Event ID:", options=df_events['ID'].tolist(), key='delete_event_id', label_visibility="collapsed")
        if st.button("Delete Event", key='btn_delete_event', use_container_width=True):
            delete_item('events', event_id_to_delete)
            
if not st.session_state.tasks and not st.session_state.goals and not st.session_state.events:
    st.info("No items recorded yet!")

st.markdown("---")

## 🗓️ **Interactive Calendar View**

# --- Prepare Calendar Data ---
calendar_events = []
priority_colors = {"High": "#FF4B4B", "Medium": "#FFC000", "Low": "#4BCB58"} 
goal_color = "#3498DB" # Define the goal_color here!

# 1. Convert Tasks to Calendar Events (Existing Code)
for task in st.session_state.tasks:
    if not task['completed']:
        task_datetime = datetime.combine(task['date'], task['time'])
        calendar_events.append({
            'title': f"Task: {task['task']} ({task['priority']})",
            'start': task_datetime.isoformat(),
            'color': priority_colors[task['priority']],
            'id': f"task-{task['id']}", 
            'extendedProps': {'type': 'task', 'item_id': task['id']}
        })

# 2. Add Goals to Calendar Events (Existing Code)
for goal in st.session_state.goals:
    if not goal['completed']:
        goal_date = goal['deadline']
        calendar_events.append({
            'title': f"Goal: {goal['name']}",
            'start': goal_date.isoformat(), 
            'allDay': True,
            'color': goal_color,
            'id': f"goal-{goal['id']}", 
            'extendedProps': {'type': 'goal', 'item_id': goal['id']}
        })

# 3. ADD USER-DEFINED EVENTS (MISSING CODE) 📢
for event in st.session_state.events:
    calendar_events.append({
        'title': event['title'],
        'start': event['start'],
        'end': event['end'],
        'id': f"event-{event['id']}", 
        'extendedProps': {'type': 'event', 'item_id': event['id']}
    }
    )

# --- Render Calendar ---
calendar_options = {
    "initialView": "dayGridMonth",
    "headerToolbar": {
        "left": "today prev,next",
        "center": "title",
        "right": "dayGridMonth,timeGridWeek,timeGridDay"
    },
    "editable": True, 
    "selectable": True, 
}

st.subheader("Full Calendar View")


calendar_result = st_calendar_component( 
    events=calendar_events,
    options=calendar_options,
    custom_css="""
        .fc-event-title {
            color: #FFFFFF !important;
            font-weight: bold;
        }
    """,
    key='full_calendar'
)

# --- Handle Calendar Item Click for Details ---
if calendar_result.get("eventClick"):
    clicked_event = calendar_result["eventClick"]["event"]
    
    # Extract info from the calendar event object
    item_type = clicked_event['extendedProps']['type']
    item_id = clicked_event['extendedProps']['item_id']
    
    # Get the original item data from session state
    item_details = get_item_by_id(item_type + 's', item_id)
    
    if item_details:
        st.subheader(f"Details for {item_type.capitalize()}")
        if item_type == 'task':
            st.json({
                "ID": item_details['id'],
                "Task Name": item_details['task'],
                "Date": str(item_details['date']),
                "Time": str(item_details['time']),
                "Priority": item_details['priority'],
                "Completed": item_details['completed']
            })
        elif item_type == 'event':
            st.json({
                "ID": item_details['id'],
                "Title": item_details['title'],
                "Start Time": item_details['start'],
                "End Time": item_details['end']
            })
    else:
        st.warning("Could not find details for the clicked item.")