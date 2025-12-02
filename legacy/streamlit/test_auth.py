import streamlit as st

st.set_page_config(page_title="Test", layout="wide")

try:
    from auth import UserAuth, show_auth_page, logout_user, save_current_user_data
    st.success("✅ Auth module imported successfully!")
    
    # Test initialization
    if 'auth' not in st.session_state:
        st.session_state.auth = UserAuth()
    
    st.success("✅ UserAuth initialized successfully!")
    
    # Show login page
    if 'logged_in' not in st.session_state:
        st.session_state.logged_in = False
    
    if not st.session_state.logged_in:
        show_auth_page()
        st.stop()
    
    st.success("✅ You are logged in!")
    st.write(f"Username: {st.session_state.username}")
    
    if st.button("Logout"):
        logout_user()
        
except Exception as e:
    st.error(f"❌ Error: {e}")
    import traceback
    st.code(traceback.format_exc())