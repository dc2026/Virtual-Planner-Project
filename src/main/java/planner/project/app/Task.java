package planner.project.app;
import java.util.Date;
import java.util.Objects;

/**
 * @author Izzie Nielsen
 * @version 10/1/25
 * Task object containing a name, deadline, and description
 */

public class Task extends PlannerItem{
    
    //fields
    private Date deadline = new Date();
    private boolean completed;
    private Date reminderTime;

    //constructor
    public Task(String title, Date deadline, String description, Date reminderTime) {
        super(title, description);
        this.deadline = deadline;
        this.completed = false;
        this.reminderTime = reminderTime;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    public Date getReminderTime() {
        return reminderTime;
    }
    public void setReminderTime(Date reminderTime) {
        this.reminderTime = reminderTime;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        // Check equality of title/description from superclass
        if (!super.equals(o)) return false; 

        Task task = (Task) o;

        // Compare unique fields: deadline, completed status, and reminder time
        return completed == task.completed && 
               Objects.equals(deadline, task.deadline) &&
               Objects.equals(reminderTime, task.reminderTime);
    }

    @Override
    public int hashCode() {
        // Combine the superclass hash with all Task-specific fields
        return Objects.hash(super.hashCode(), deadline, completed, reminderTime);
    }
    @Override
    public String toString() {
        String reminderInfo = (reminderTime != null) 
                              ? " | Reminder: " + reminderTime 
                              : "";
        
        return "Task: " + getTitle() + 
               " | Due: " + getDeadline() +
               " | Status: " + (isCompleted() ? "COMPLETED" : "PENDING") +
               reminderInfo +
               "\n  Desc: " + getDescription() + 
               "\n----------------------------------------";   
    }
}