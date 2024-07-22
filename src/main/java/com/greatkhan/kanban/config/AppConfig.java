package com.greatkhan.kanban.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.greatkhan.kanban.database.FileManager;
import com.greatkhan.kanban.model.Kanban;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

/**
 * The AppConfig class represents the configuration class of this Java Spring application. All
 * required Beans are constructed in this class.
 */
@Configuration
public class AppConfig {
    /**
     * Constructs the ObjectMapper Bean that is used for serialization.
     *
     * @return the ObjectMapper object
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    }

    /**
     * Constructs the FileManager Bean that is used for managing the file operations for the
     * Kanban model.
     *
     * @param objectMapper the ObjectMapper to serialize with
     * @return the FileManager object
     */
    @Bean
    public FileManager fileManager(ObjectMapper objectMapper) {
        return new FileManager(objectMapper, "src/main/resources/kanban.json");
    }

    /**
     * Constructs the Kanban bean using the FileManager. This is used to initialize the Kanban
     * with data that is stored in the database managed by the FileManager.
     *
     * @param fileManager the FileManager object used to populate the Kanban
     * @return the Kanban model stored in the database
     * @throws IOException if the file could not be accessed
     */
    @Bean
    public Kanban kanban(FileManager fileManager) throws IOException {
        return fileManager.readKanban();
    }

    /**
     * Constructs the RequestFilter bean using the Kanban model and the FileManager.
     *
     * @param kanban the Kanban to use in file management
     * @param fileManager the FileManager to serialize with
     * @return the RequestFilter bean
     */
    @Bean
    public FilterRegistrationBean<RequestFilter> requestFilter(Kanban kanban, FileManager fileManager) {
        FilterRegistrationBean<RequestFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RequestFilter(kanban, fileManager));
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
}
