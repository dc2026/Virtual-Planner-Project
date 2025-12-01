package planner.project.app;
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
    // --- START OF NEW METHODS ---
    @Override // Line 35: Start of the equals() method
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        PlannerItem that = (PlannerItem) o;
        
        // Use Objects.equals for safe comparison of potentially null Strings
        return java.util.Objects.equals(title, that.title) &&
               java.util.Objects.equals(description, that.description);
    }

    @Override // Line 46: Start of the hashCode() method
    public int hashCode() {
        // Generates a hash based on the core properties
        return java.util.Objects.hash(title, description);
    }
    // --- END OF NEW METHODS ---
}
    
