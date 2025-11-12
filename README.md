# Virtual Planner

Authors: Izzie Nielsen, Danielle Carrol, and Becca Borgmeier

The project creates an online planner for users to add tasks, events, and goals. Users will be able to track their progress and manage their schedule through this application.
This project is in development for our Software Engineering course to practice object oriented programming, project management, agile development process, front end development, git/github
and project integration.

## Backend Implementation

The application uses Java to implement the backend of the project. Here are the classes:

### PlannerItem
* Abstract class inherited by all other objects
* String title: name of the planner item
* String description: optional description for the planner item

### Event
* Event class would include appointments, meetings, or get-togethers
* Date date: the date of the event

### Goal
* Goal class would be a broad, long term effort
* String timeframe: description of desired length til goal completetion
* ArrayList<Task> tasklist: arraylist of tasks, allowing users to connect task completetion to their goals

### Task
* Task class is a short term deadline, like a homework assignment, project, or application
* Date dealine: date a task needs to be completed by
* Boolean progress: tracks the progress of the task

## Requirements

### Libraries:
* Java date object library
    * import java.util.Date
