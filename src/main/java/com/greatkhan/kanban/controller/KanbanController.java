package com.greatkhan.kanban.controller;

import com.greatkhan.kanban.model.Column;
import com.greatkhan.kanban.model.Kanban;
import com.greatkhan.kanban.model.Projects;
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
    private final Projects projects;
//    private final Kanban kanban;

    /**
     * Constructs a new KanbanController with the specified Projects object as the model to modify.
     *
     * @param projects the Projects model that this controller modifies
     */
    @Autowired
    public KanbanController(Projects projects) {
        this.projects = projects;
//        this.kanban = kanban;
    }

    /**
     * Retrieves the Projects model object.
     *
     * @return the Projects model
     */
    @GetMapping("/projects")
    public Projects getProjects() {
        return projects;
    }

    /**
     * Retrieves the Kanban model object.
     *
     * @return the Kanban model
     */
    @GetMapping("/kanban/{id}")
    public Kanban getKanban(@PathVariable UUID id) {
        return projects.getKanban(id);
    }

    /**
     * Creates a Kanban identical to the specified Kanban and adds it to the Projects model.
     *
     * @param kanban the Column to create
     */
    @PostMapping("/createKanban")
    public void createKanban(@RequestBody Kanban kanban) {
        kanban.setId(UUID.randomUUID());
        projects.addKanban(kanban);
    }

    /**
     * Updates the model using the specified Kanban. Every field in the Kanban model will be
     * modified based on the Kanban passed in to this method.
     *
     * @param kanban the Kanban model to update
     */
    @PutMapping("/updateKanban")
    public void updateKanban(@RequestBody Kanban kanban) {
        projects.updateKanban(kanban);
    }

    /**
     * Deletes the specified Kanban.
     *
     * @param kanban the Kanban to delete
     */
    @DeleteMapping("/deleteKanban")
    public void deleteKanban(@RequestBody Kanban kanban) {
        projects.removeKanban(kanban.getId());
    }

    /**
     * Creates a Column identical to the specified Kanban and adds it to the Projects model. The
     * Column will be appended with a default Task as a placeholder for user changes
     *
     * @param kanban the Column to create
     */
    @PostMapping("/createColumn")
    public void createColumn(@RequestBody Kanban kanban) {
        Column c = new Column();
        c.setTitle(kanban.getTitle());
        c.setDescription(kanban.getDescription());
        c.setId(UUID.randomUUID());
        c.addTask(new Task());
        projects.getKanban(kanban.getId()).addColumn(c);

//        column.addTask(new Task());
//        projects.getKanban(column.getId()).addColumn(column);
    }

    /**
     * Updates the specified Column.
     *
     * @param column the Column to update
     */
    @PutMapping("/updateColumn")
    public void updateColumn(@RequestBody Column column) {
        projects.getKanbanOfColumn(column.getId()).updateColumn(column);
    }

    /**
     * Deletes the specified Column.
     *
     * @param column the Column to delete
     */
    @DeleteMapping("/deleteColumn")
    public void deleteColumn(@RequestBody Column column) {
        projects.getKanbanOfColumn(column.getId()).removeColumn(column.getId());
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
        projects.getKanbanOfColumn(column.getId()).getColumn(column.getId()).addTask(t);
    }

    /**
     * Updates the specified Task.
     *
     * @param task the Task to update
     */
    @PutMapping("/updateTask")
    public void updateTask(@RequestBody Task task) {
        UUID id = task.getId();
        projects.getKanbanOfTask(id).getColumnOfTask(id).updateTask(task);
    }

    /**
     * Deletes the specified Task.
     *
     * @param task the Task to delete
     */
    @DeleteMapping("/deleteTask")
    public void deleteTask(@RequestBody Task task) {
        UUID id = task.getId();
        projects.getKanbanOfTask(id).getColumnOfTask(id).removeTask(id);
    }
}
