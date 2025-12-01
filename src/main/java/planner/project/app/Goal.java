package planner.project.app;

import java.util.ArrayList;
import java.util.Objects;

/**
 * @author Izzie Nielsen
 * @version 10/26/2025
 * Represents a Goal containing a list of tasks and a timeframe.
 */
public class Goal extends PlannerItem {

    private String timeframe;
    private ArrayList<Task> taskList;

    // Constructor
    public Goal(String title, String description, String timeframe, ArrayList<Task> taskList){
        super(title, description);
        this.timeframe = timeframe;
        this.taskList = taskList;
    }

    // Getter & Setter for timeframe
    public String getTimeframe() {
        return timeframe;
    }

    public void setTimeframe(String timeframe) {
        this.timeframe = timeframe;
    }

    // Getter & Setter for taskList
    public ArrayList<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(ArrayList<Task> taskList) {
        this.taskList = taskList;
    }

    // Add or remove a task
    public void addToTaskList(Task toAdd){
        taskList.add(toAdd);
    }

    public void removeFromTaskList(Task toRemove){
        taskList.remove(toRemove);
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Goal)) return false;
        if (!super.equals(o)) return false;
        Goal goal = (Goal) o;
        return Objects.equals(timeframe, goal.timeframe) &&
               Objects.equals(taskList, goal.taskList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), timeframe, taskList);
    }
}
