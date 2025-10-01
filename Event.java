import java.util.Date;

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

}
