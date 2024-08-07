package com.greatkhan.kanban.model;

import org.springframework.stereotype.Repository;

import java.util.LinkedList;
import java.util.UUID;

/**
 * The Projects class contains a list of the existing Kanban projects.
 */
@Repository
public class Projects {
    private LinkedList<Kanban> kanbans;

    public Projects() {
        kanbans = new LinkedList<>();
        kanbans.add(new Kanban());  // TEMPORARY! REMOVE!
    }

    /**
     * Retrieves the list of Kanbans.
     *
     * @return the list of Kanbans
     */
    public LinkedList<Kanban> getKanbans() {
        return kanbans;
    }

    /**
     * Sets the list of Kanbans to the specified list.
     *
     * @param kanbans the new list of Kanbans
     */
    public void setKanbans(LinkedList<Kanban> kanbans) {
        this.kanbans = kanbans;
    }

    /**
     * Retrieves the Kanban of the specified UUID. This will return null if there is no Kanban
     * that matches the specified UUID.
     *
     * @param id the UUID of the Kanban to retrieve
     * @return the matching Kanban, null if no Kanban matches the UUID
     */
    public Kanban getKanban(UUID id) {
        for (Kanban k : kanbans) {
            if (k.getId().equals(id)) {
                return k;
            }
        }
        return null;
    }

    /**
     * Adds a Kanban to the list of Kanbans
     *
     * @param kanban the Column to add
     */
    public void addKanban(Kanban kanban) {
        kanbans.add(kanban);
    }

    /**
     * Updates the specified Kanban.
     *
     * @param kanban the Column to update
     */
    public void updateKanban(Kanban kanban) {
        Kanban k = getKanban(kanban.getId());
        k.setTitle(kanban.getTitle());
        k.setDescription(kanban.getDescription());
        k.setColumns(kanban.getColumns());
    }

    /**
     * Removes the Kanban matching the UUID. If there is no Kanban that matches the UUID, the
     * list of Kanbans remains unchanged.
     *
     * @param id the UUID of the Kanban to remove
     */
    public void removeKanban(UUID id) {
        for (Kanban k : kanbans) {
            if (k.getId().equals(id)) {
                kanbans.remove(k);
                break;
            }
        }
    }

    /**
     * Retrieves the Kanban that matches the UUID of a Column. If there is no Kanban that contains
     * the UUID's Column, the return will be null.
     *
     * @param id the UUID of a Column
     * @return the Kanban of the Column, null if no Kanban contains this UUID's task
     */
    public Kanban getKanbanOfColumn(UUID id) {
        for (Kanban k : kanbans) {
            LinkedList<Column> columns = k.getColumns();
            for (Column c : columns) {
                if (c.getId().equals(id)) {
                    return k;
                }
            }
        }
        return null;
    }

    /**
     * Retrieves the Kanban that matches the UUID of a Column. If there is no Kanban that contains
     * the UUID's Column, the return will be null.
     *
     * @param id the UUID of a Column
     * @return the Kanban of the Column, null if no Kanban contains this UUID's task
     */
    public Kanban getKanbanOfTask(UUID id) {
        for (Kanban k : kanbans) {
            for (Column c : k.getColumns()) {
                LinkedList<Task> tasks = c.getTasks();
                for (Task t : tasks) {
                    if (t.getId().equals(id)) {
                        return k;
                    }
                }
            }
        }
        return null;
    }
}
