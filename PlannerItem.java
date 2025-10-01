/**
 * @author Izzie Nielsen
 * @version 10/1/2025
 * Abstract planner item class
 */


public abstract class PlannerItem {
    private String title;
    private String description;
   

    public PlannerItem(String title, String description){
        this.title = title;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
