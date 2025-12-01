package planner.project.app;
import planner.project.app.PlannerItem;
import java.util.Date;
import java.util.Objects;

/**
 * @author Izzie Nielsen
 * @version 10/1/2025
 * Class to create event items
 */

public class Event extends PlannerItem{
    
    private Date date;

    public Event(String title, String description, Date date){
        super(title, description);
        this.date = date;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false; 
        
        Event event = (Event) o;
        
        // Compare the Event's unique field: date
        return java.util.Objects.equals(date, event.date);
    }

    @Override
    public int hashCode() {
        // Combine the superclass hash with the date hash
        return java.util.Objects.hash(super.hashCode(), date);
    }
}

    
