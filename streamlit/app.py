import streamlit as st
from streamlit_calendar import calendar

st.title("Virtual Planner")

col1, col2, col3 = st.columns([1,1,1])

with col1:
    task_pressed = st.button("TASK")
    if task_pressed:
        st.write("enter Task details")

with col2:
    goal_pressed = st.button("GOAL")
    if goal_pressed:
        st.write("enter Goal details")

with col3:
    event_pressed = st.button("EVENT")
    if event_pressed:
        st.write("enter Event details")


calendar_events = []

calendar_options = {
    "initialView": "dayGridMonth",
    "editable": True,
    "selectable": True,
}

calendar = calendar (events = calendar_events, options= calendar_options, key = 'calendar')

