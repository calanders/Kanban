package com.greatkhan.kanban.model;

import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.UUID;

/**
 * Column is a model class that encapsulates all components of a Column of a Kanban project. This
 * includes the title, description, and unique ID of the Column as well as the list of Tasks
 * contained in this project.
 */
@Repository
public class Column {
    private String title;
    private String description;
    private UUID id;
    private LinkedList<Task> tasks;

    /**
     * Constructs a new Column with title "New Column" and an empty description.
     */
    public Column() {
        this("New Column", "");
    }

    /**
     * Constructs a new Column with specified title and description.
     *
     * @param title the title of the Column
     * @param description the description of the Column
     */
    public Column(String title, String description) {
        this.title = title;
        this.description = description;
        id = UUID.randomUUID();
        tasks = new LinkedList<>();
        tasks.add(new Task());
    }

    /**
     * Retrieves the title of this Column.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of this Column to the specified title.
     *
     * @param title the new title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Retrieves the description of this Column.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of this Column to the specified description.
     *
     * @param description the new title
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Retrieves the UUID of this Column.
     *
     * @return the UUID
     */
    public UUID getId() {
        return id;
    }

    /**
     * Sets the UUID of this Column to the specified UUID.
     *
     * @param id the new UUID
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * Retrieves the list of Tasks of this Column.
     *
     * @return the list of Tasks
     */
    public LinkedList<Task> getTasks() {
        return tasks;
    }

    /**
     * Sets the list of Tasks of this Column to the specified list
     *
     * @param tasks the new list of Tasks
     */
    public void setTasks(LinkedList<Task> tasks) {
        this.tasks = tasks;
    }

    /**
     * Retrieves the Task of the specified UUID. This will return null if there is no Task that
     * matches the specified UUID.
     *
     * @param id the UUID of the Task to retrieve
     * @return the matching Task, null if no Task matches the UUID
     */
    public Task getTask(UUID id) {
        for (Task t : tasks) {
            if (t.getId().equals(id)) {
                return t;
            }
        }
        return null;
    }

    /**
     * Adds a Task to the list of Tasks of this Column.
     *
     * @param task the Task to add
     */
    public void addTask(Task task) {
        tasks.add(task);
    }

    /**
     * Updates the specified Task.
     *
     * @param task the Task to update
     */
    public void updateTask(Task task) {
        Task t = getTask(task.getId());
        t.setTitle(task.getTitle());
        t.setDescription(task.getDescription());
    }

    /**
     * Removes the Task matching the UUID. If there is no Task that matches the UUID, the list of
     * Tasks remains unchanged.
     *
     * @param id the UUID of the Task to remove
     */
    public void removeTask(UUID id) {
        for (Task t : tasks) {
            if (t.getId().equals(id)) {
                tasks.remove(t);
                break;
            }
        }
    }
}
