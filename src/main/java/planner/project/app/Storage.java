package planner.project.app;

import java.util.ArrayList;

/**
 * @author Izzie Nielsen
 * @version 10/26/2025
 * Class to store created objects using array lists
 * Temporary storage for the development process, will switch after backend is finished
 */



public class Storage {
   private ArrayList<Goal> goalList = new ArrayList<>();
   private ArrayList<Event> eventList = new ArrayList<>();
   private ArrayList<Task> taskList = new ArrayList<>();

   public void addGoal(Goal g){
        goalList.add(g);
   }

   public void removeGoal(Goal g){
        for (int i = 0; i < goalList.size(); i++) {
            if(g == goalList.get(i)){
                goalList.remove(i);
                break;
            }
        }
   }

   public void addEvent(Event e){
        eventList.add(e);
   }

   public void removeEvent(Event e){
        for (int i = 0; i < goalList.size(); i++) {
            if(e == eventList.get(i)){
                eventList.remove(i);
                break;
            }
        }
   }

   public void addTask(Task t){
        taskList.add(t);
   }

   public void removeTask(Task t){
        for (int i = 0; i < goalList.size(); i++) {
            if(t == taskList.get(i)){
                taskList.remove(i);
                break;
            }
        }
   }
public ArrayList<Goal> getGoalList() {
    return goalList;
}

public ArrayList<Event> getEventList() {
    return eventList;
}

public ArrayList<Task> getTaskList() {
    return taskList;
}
/**
     * Replaces the current task list with a new one loaded from storage (Gson).
     * This resolves the 'cannot find symbol: setTaskList' error.
     * @param taskList The list of tasks loaded by Gson.
     */
    public void setTaskList(ArrayList<Task> taskList) { 
        this.taskList = taskList; 
    }

    /**
     * Replaces the current event list with a new one loaded from storage (Gson).
     * @param eventList The list of events loaded by Gson.
     */
    public void setEventList(ArrayList<Event> eventList) { 
        this.eventList = eventList; 
    }
    
    /**
     * Replaces the current goal list with a new one loaded from storage (Gson).
     * @param goalList The list of goals loaded by Gson.
     */
    public void setGoalList(ArrayList<Goal> goalList) { 
        this.goalList = goalList;
    }
}
