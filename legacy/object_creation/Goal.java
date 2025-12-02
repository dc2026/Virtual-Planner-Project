import java.util.ArrayList;


public class Goal extends PlannerItem{
    
    private String timeframe;
    private ArrayList <Task> taskList = new ArrayList<>();


    public Goal(String title, String description, String timeframe, ArrayList<Task> taskList){
        super(title, description);
        this.timeframe = timeframe;
    }

    public String getTimeframe() {
        return timeframe;
    }

    public void setTimeframe(String timeframe) {
        this.timeframe = timeframe;
    }

    public ArrayList<Task> getTaskList() {
        return taskList;
    }

    public void setTaskList(ArrayList<Task> taskList) {
        this.taskList = taskList;
    }

    public void addToTaskList(Task toAdd){
        taskList.add(toAdd);
    }

    public void removeFromTaskList(Task toRemove){
        for (int i = 0; i < taskList.size(); i++){
            if(taskList.get(i) == toRemove){
                taskList.remove(i);
                break;
            }
        }
    }
   
}
