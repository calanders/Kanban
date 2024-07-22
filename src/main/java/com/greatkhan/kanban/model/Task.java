package com.greatkhan.kanban.model;

import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Task is a model class that encapsulates all components of a Task of a Kanban project. This
 * includes the title, description, and unique ID of the Task.
 */
@Repository
public class Task {
    private String title;
    private String description;
    private UUID id;

    /**
     * Constructs a new Task with title "New Column" and an empty description.
     */
    public Task() {
        this("New Task", "");
    }

    /**
     * Constructs a new Task with specified title and description.
     *
     * @param title the title of the Task
     * @param description the description of the Task
     */
    public Task(String title, String description) {
        this.title = title;
        this.description = description;
        id = UUID.randomUUID();
    }

    /**
     * Retrieves the title of this Task.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of this Task to the specified title.
     *
     * @param title the new title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Retrieves the description of this Task.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of this Task to the specified description.
     *
     * @param description the new title
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Retrieves the UUID of this Task.
     *
     * @return the UUID
     */
    public UUID getId() {
        return id;
    }

    /**
     * Sets the UUID of this Task to the specified UUID.
     *
     * @param id the new UUID
     */
    public void setId(UUID id) {
        this.id = id;
    }
}
