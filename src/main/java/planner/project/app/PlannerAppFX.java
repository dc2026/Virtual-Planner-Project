// PlannerAppFX.java
package planner.project.app;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class PlannerAppFX extends Application {

    private PlannerService service; // Will be initialized here and used for saving data

    @Override
    public void start(Stage primaryStage) throws Exception {
        // 1. Initialize the service layer
        // This automatically calls loadData() inside the PlannerService constructor
        service = new PlannerService(); 
        
        // 2. Load the FXML file (the visual layout)
        // Note: The path starts with "/" to look in the src/main/resources folder
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/PlannerView.fxml"));
        Parent root = loader.load();
        
        // 3. Inject the service into the Controller
        PlannerController controller = loader.getController();
        controller.initializeService(service);

        // 4. Set up the window (Stage)
        Scene scene = new Scene(root, 1000, 700);
        primaryStage.setTitle("Virtual Planner - JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
        
        // 5. Shutdown Hook: Save data when the user clicks the 'X' button
        primaryStage.setOnCloseRequest(event -> {
            System.out.println("Application closing. Saving data...");
            service.saveData(); 
            // Stop the background reminder thread
            System.exit(0); 
        });
    }

    public static void main(String[] args) {
        // This method starts the JavaFX runtime.
        // It's technically optional when using 'mvn javafx:run', but is good practice.
        launch(args);
    }
}