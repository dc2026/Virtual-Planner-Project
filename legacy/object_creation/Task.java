import java.util.Date;

/**
 * @author Izzie Nielsen
 * @version 10/1/25
 * Task object containing a name, deadline, and description
 */

public class Task extends PlannerItem{
    
    //fields
    private Date deadline = new Date();
    private boolean completed;

    //constructor
    public Task(String title, Date deadline, String description){
        super(title, description);
        this.deadline = deadline;
        this.completed = false;
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

    
}


