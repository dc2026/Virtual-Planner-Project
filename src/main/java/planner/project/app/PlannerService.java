package planner.project.app;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Date;

/**
 * @author Danielle Carrol
 * @version 11/1/2025
 * Service layer for managing planner items
 */
public class PlannerService {
    private static final String DATA_FILE = "planner_data.json";
    private final Gson gson;
    private Storage storage;
    private Timer reminderTimer; // Timer for the background reminder thread

    // Constructor initializes the Storage and loads data
    public PlannerService() {
        this.gson = new GsonBuilder().setPrettyPrinting().create();
        this.storage = new Storage();
        loadData(); 
        startReminderScheduler();
    }
    
    // ----------------------------------------------------------------
    // 💾 DATA PERSISTENCE
    // ----------------------------------------------------------------
    
    public void saveData() {
        try (FileWriter writer = new FileWriter(DATA_FILE)) {
            DataContainer container = new DataContainer(
                storage.getTaskList(), 
                storage.getEventList(), 
                storage.getGoalList()
            );
            gson.toJson(container, writer);
            System.out.println("💾 Data successfully saved to " + DATA_FILE);
        } catch (IOException e) {
            System.err.println("❌ ERROR saving data: " + e.getMessage());
        }
    } // <--- CORRECTED: Closing brace for saveData()
    
    private void loadData() {
        try (FileReader reader = new FileReader(DATA_FILE)) {
            // Define the type for Gson to deserialize (the DataContainer class)
            Type containerType = new TypeToken<DataContainer>(){}.getType();
            
            DataContainer container = gson.fromJson(reader, containerType);
            
            if (container != null) {
                // Use the setters in Storage to populate the lists
                storage.setTaskList(new ArrayList<>(container.tasks));
                storage.setEventList(new ArrayList<>(container.events));
                storage.setGoalList(new ArrayList<>(container.goals));
                System.out.println("✅ Planner data loaded successfully from file.");
            }
        } catch (IOException e) {
            System.out.println("ℹ️ No existing data file found. Starting fresh.");
        }
    }

    // ----------------------------------------------------------------
    // ⏰ REMINDER SCHEDULER (Logic referenced in constructor)
    // ----------------------------------------------------------------
    
    private void startReminderScheduler() {
        reminderTimer = new Timer(true); // true makes it a background (daemon) thread
        
        // Check every 60 seconds (60,000 milliseconds)
        reminderTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                checkReminders();
            }
        }, 1000, 60000); 
    }

    private void checkReminders() {
        Date now = new Date();
        
        // Check Tasks
        for (Task task : storage.getTaskList()) {
            Date reminder = task.getReminderTime();
            // Check if reminder is set and is BEFORE the current time
            if (reminder != null && reminder.before(now)) {
                // In a JavaFX app, this should trigger a UI notification
                System.out.println("\n🔔 REMINDER (Task): " + task.getTitle() + " is due!");
                // Prevent it from reminding again by setting it to null
                task.setReminderTime(null); 
            }
        }
        // Future: Add logic for Events here
    }

    // ----------------------------------------------------------------
    // ➕ CRUD METHODS
    // ----------------------------------------------------------------

    public void addGoal(Goal goal) { storage.addGoal(goal); }
    public void removeGoal(Goal goal) { storage.removeGoal(goal); }
    public void addEvent(Event event) { storage.addEvent(event); }
    public void addTask(Task task) { storage.addTask(task); }

    // ----------------------------------------------------------------
    // 🔎 VIEW & FILTER METHODS
    // ----------------------------------------------------------------

    public List<Goal> getAllGoals() { return storage.getGoalList(); }
    public List<Event> getAllEvents() { return storage.getEventList(); }
    public List<Task> getAllTasks() { return storage.getTaskList(); }
    
    public List<Task> getPendingTasks() {
        return storage.getTaskList().stream()
                .filter(task -> !task.isCompleted())
                .collect(Collectors.toList());
    }
    
    // ----------------------------------------------------------------
    // ⚙️ ACTION METHODS
    // ----------------------------------------------------------------

    public boolean markTaskComplete(String taskTitle) {
        for (Task task : storage.getTaskList()) {
            if (task.getTitle().equalsIgnoreCase(taskTitle)) {
                task.setCompleted(true);
                return true;
            }
        }
        return false;
    }

    // ----------------------------------------------------------------
    // 📦 GSON HELPER CLASS (Defined once at the end)
    // ----------------------------------------------------------------

    private static class DataContainer {
        List<Task> tasks;
        List<Event> events;
        List<Goal> goals;

        public DataContainer(List<Task> tasks, List<Event> events, List<Goal> goals) {
            this.tasks = tasks;
            this.events = events;
            this.goals = goals;
        }
    }
}