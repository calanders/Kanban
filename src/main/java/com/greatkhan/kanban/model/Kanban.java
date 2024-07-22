package com.greatkhan.kanban.model;

import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.UUID;

/**
 * Kanban is a model class that encapsulates all components of a Kanban project. This includes
 * the title, description, and unique ID of the Kanban as well as the list of Columns contained
 * in this project.
 */
@Repository
public class Kanban {
    private String title;
    private String description;
    private UUID id;
    private LinkedList<Column> columns;

    /**
     * Constructs a new Kanban with title "New Kanban" and an empty description.
     */
    public Kanban() {
        this("New Kanban", "");
    }

    /**
     * Constructs a new Kanban with specified title and description.
     *
     * @param title the title of the Kanban
     * @param description the description of the Kanban
     */
    public Kanban(String title, String description) {
        this.title = title;
        this.description = description;
        id = UUID.randomUUID();
        columns = new LinkedList<>();
    }

    /**
     * Retrieves the title of this Kanban.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the title of this Kanban to the specified title.
     *
     * @param title the new title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Retrieves the description of this Kanban.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of this Kanban to the specified description.
     *
     * @param description the new title
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Retrieves the UUID of this Kanban.
     *
     * @return the UUID
     */
    public UUID getId() {
        return id;
    }

    /**
     * Sets the UUID of this Kanban to the specified UUID.
     *
     * @param id the new UUID
     */
    public void setId(UUID id) {
        this.id = id;
    }

    /**
     * Retrieves the list of Columns of this Kanban.
     *
     * @return the list of Columns
     */
    public LinkedList<Column> getColumns() {
        return columns;
    }

    /**
     * Sets the list of Columns of this Kanban to the specified list
     *
     * @param columns the new list of Columns
     */
    public void setColumns(LinkedList<Column> columns) {
        this.columns = columns;
    }

    /**
     * Retrieves the Column of the specified UUID. This will return null if there is no Column
     * that matches the specified UUID.
     *
     * @param id the UUID of the Column to retrieve
     * @return the matching Column, null if no Column matches the UUID
     */
    public Column getColumn(UUID id) {
        for (Column c : columns) {
            if (c.getId().equals(id)) {
                return c;
            }
        }
        return null;
    }

    /**
     * Adds a Column to the list of Columns of this Kanban.
     *
     * @param column the Column to add
     */
    public void addColumn(Column column) {
        columns.add(column);
    }

    /**
     * Updates the specified Column.
     *
     * @param column the Column to update
     */
    public void updateColumn(Column column) {
        Column c = getColumn(column.getId());
        c.setTitle(column.getTitle());
        c.setDescription(column.getDescription());
        c.setTasks(column.getTasks());
    }

    /**
     * Removes the Column matching the UUID. If there is no Column that matches the UUID, the
     * list of Columns remains unchanged.
     *
     * @param id the UUID of the Column to remove
     */
    public void removeColumn(UUID id) {
        for (Column c : columns) {
            if (c.getId().equals(id)) {
                columns.remove(c);
                break;
            }
        }
    }

    /**
     * Retrieves the Column that matches the UUID of a Task. If there is no Column that contains
     * the UUID's Task, the return will be null.
     *
     * @param id the UUID of a Task
     * @return the Column of the Task, null if no Column contains this UUID's task
     */
    public Column getColumnOfTask(UUID id) {
        for (Column c : columns) {
            LinkedList<Task> tasks = c.getTasks();
            for (Task t : tasks) {
                if (t.getId().equals(id)) {
                    return c;
                }
            }
        }
        return null;
    }
}
