// PlannerController.java
package planner.project.app;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import java.net.URL;
import java.util.ResourceBundle;
import javafx.scene.control.Label;
import javafx.fxml.Initializable; // Interface for initialization

public class PlannerController implements Initializable {

    private PlannerService service;

    // FXML Annotations (These map to elements defined in PlannerView.fxml)
    @FXML private Button addTaskButton;
    @FXML private TableView<Task> taskTable;
    @FXML private TextField titleInput;
    @FXML private Label statusMessage; 
    
    // --- Lifecycle and Initialization ---

    // This is the standard JavaFX initialization method
    @Override
    public void initialize(URL url, ResourceBundle rb) {
        // Setup table columns here, once we have the FXML structure defined.
        // E.g., taskTable.setItems(FXCollections.observableArrayList(service.getAllTasks()));
    }
    
    // Custom method to inject the PlannerService AFTER initialization
    public void initializeService(PlannerService service) {
        this.service = service;
        // Load initial data into the table after the service is ready
        loadTaskData();
    }
    
    // --- FXML Event Handlers ---
    
    @FXML
    private void handleAddTask() {
        // Example logic:
        String title = titleInput.getText();
        if (title != null && !title.trim().isEmpty()) {
            // For now, we create a task with minimal data (you'll expand this later)
            Task newTask = new Task(title, null, "Added via GUI", null); 
            service.addTask(newTask);
            titleInput.clear();
            statusMessage.setText("Task '" + title + "' added!");
            loadTaskData(); // Refresh the table
        } else {
            statusMessage.setText("Title cannot be empty.");
        }
    }
    
    // --- Data Loading ---
    
    private void loadTaskData() {
        // This is a placeholder; needs proper JavaFX ObservableList setup
        // taskTable.setItems(FXCollections.observableArrayList(service.getAllTasks()));
        // For now, just confirming service works:
        System.out.println("Service data loaded. Total tasks: " + service.getAllTasks().size());
    }
}