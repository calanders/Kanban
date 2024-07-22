package com.greatkhan.kanban.config;

import com.greatkhan.kanban.database.FileManager;
import com.greatkhan.kanban.model.Kanban;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * The RequestFilter class is used to filter HTTP requests made to and from the Java Spring
 * server. This is used to update the database every time new information is added, so that
 * the application and database are never out of synchronization.
 */
@WebFilter(urlPatterns = "/*")
public class RequestFilter implements Filter {
    private final Kanban kanban;
    private final FileManager fileManager;

    /**
     * Constructs a new RequestFilter with the specified Kanban model and FileManager.
     *
     * @param kanban the Kanban to use in file management
     * @param fileManager the FileManager to serialize with
     */
    public RequestFilter(Kanban kanban, FileManager fileManager) {
        this.kanban = kanban;
        this.fileManager = fileManager;
    }

    /**
     * Filters the inbound and outbound HTTP requests. When an incoming HTTP request is
     * intercepted, the database specified by the FileManager of this RequestFilter will
     * be updated to maintain data synchronization.
     *
     * @param servletRequest The request to process
     * @param servletResponse The response associated with the request
     * @param filterChain Provides access to the next filter in the chain for this filter to pass
     *                    the request and response to for further processing
     *
     * @throws ServletException if there is a problem with the HTTP request
     * @throws IOException if the request cannot be accessed
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws ServletException, IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");

        fileManager.writeKanban(kanban);

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}
