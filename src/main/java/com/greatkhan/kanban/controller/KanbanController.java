package com.greatkhan.kanban.controller;

import com.greatkhan.kanban.model.Column;
import com.greatkhan.kanban.model.Kanban;
import com.greatkhan.kanban.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * The KanbanController class functions as a controller for the REST API used by The Great Khan
 * Board's website client. This class contains all the HTTP methods required to use this Kanban
 * in a Create-Read-Update-Delete (CRUD) manner.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class KanbanController {
    private final Kanban kanban;

    /**
     * Constructs a new KanbanController with the specified Kanban object as the model to modify.
     *
     * @param kanban the Kanban model that this controller modifies
     */
    @Autowired
    public KanbanController(Kanban kanban) {
        this.kanban = kanban;
    }

    /**
     * Retrieves the Kanban model object.
     *
     * @return the Kanban model
     */
    @GetMapping("/kanban")
    public Kanban getKanban() {
        return kanban;
    }

    /**
     * Updates the model using the specified Kanban. Every field in the Kanban model will be
     * modified based on the Kanban passed in to this method.
     *
     * @param kanban the Kanban model to update
     */
    @PutMapping("/updateKanban")
    public void updateKanban(@RequestBody Kanban kanban) {
        this.kanban.setTitle(kanban.getTitle());
        this.kanban.setDescription(kanban.getDescription());
        this.kanban.setId(kanban.getId());
        this.kanban.setColumns(kanban.getColumns());
    }

    /**
     * Creates a Column identical to the specified Column and adds it to the Kanban model. The
     * Column will be appended with a default Task as a placeholder for user changes
     *
     * @param column the Column to create
     */
    @PostMapping("/createColumn")
    public void createColumn(@RequestBody Column column) {
        column.setId(UUID.randomUUID());
        column.addTask(new Task());
        kanban.addColumn(column);
    }

    /**
     * Updates the specified Column.
     *
     * @param column the Column to update
     */
    @PutMapping("/updateColumn")
    public void updateColumn(@RequestBody Column column) {
        kanban.updateColumn(column);
    }

    /**
     * Deletes the specified Column.
     *
     * @param column the Column to delete
     */
    @DeleteMapping("/deleteColumn")
    public void deleteColumn(@RequestBody Column column) {
        kanban.removeColumn(column.getId());
    }

    /**
     * Creates a Task identical to the specified Column and adds it to the Column. The Column
     * argument should contain the title and description of the Task to be created. The parameter
     * needs to be a Column because its UUID  is needed to add the Task to the appropriate
     * destination Column.
     *
     * @param column the Task to create
     */
    @PostMapping("/createTask")
    public void createTask(@RequestBody Column column) {
        Task t = new Task();
        t.setTitle(column.getTitle());
        t.setDescription(column.getDescription());
        t.setId(UUID.randomUUID());
        kanban.getColumn(column.getId()).addTask(t);
    }

    /**
     * Updates the specified Task.
     *
     * @param task the Task to update
     */
    @PutMapping("/updateTask")
    public void updateTask(@RequestBody Task task) {
        kanban.getColumnOfTask(task.getId()).updateTask(task);
    }

    /**
     * Deletes the specified Task.
     *
     * @param task the Task to delete
     */
    @DeleteMapping("/deleteTask")
    public void deleteTask(@RequestBody Task task) {
        kanban.getColumnOfTask(task.getId()).removeTask(task.getId());
    }
}
