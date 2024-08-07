package com.greatkhan.kanban.database;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.MismatchedInputException;
import com.greatkhan.kanban.model.Projects;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

/**
 * The FileManager class is used to write Kanban model objects to a specified File in JSON format.
 */
@Component
public class FileManager {
    private final ObjectMapper objectMapper;
    private final String filePath;

    /**
     * Constructs a new FileManager with specified ObjectMapper and a file path String.
     *
     * @param objectMapper the ObjectMapper to use for serialization
     * @param filePath the file path to read and write from
     */
    public FileManager(ObjectMapper objectMapper, String filePath) {
        this.objectMapper = objectMapper;
        this.filePath = filePath;
    }

    /**
     * Retrieves the Projects model object from the file specified during construction of this
     * class. If an invalid Projects JSON object exists at the specified file, a new Projects will
     * be created and returned.
     *
     * @return the Kanban model object
     */
    public Projects readProjects() {
        try {
            return objectMapper.readValue(new File(filePath), Projects.class);
        } catch (MismatchedInputException e) {
            System.err.println("Invalid content in the file. Creating a default Projects object.");
            return new Projects();
        } catch (IOException e) {
            System.err.println("IOException occurred while reading the file. Creating a default Projects object.");
            return new Projects();
        }
    }

    /**
     * Serializes the Projects model object to the file specified during construction of this class.
     *
     * @param projects the Projects model object to serialize
     */
    public void writeKanban(Projects projects) {
        try {
            objectMapper.writeValue(new File(filePath), projects);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
