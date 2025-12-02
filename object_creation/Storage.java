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

}
