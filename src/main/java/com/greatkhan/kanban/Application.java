package com.greatkhan.kanban;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The Application class is the starting point of the Kanban Java Spring server. When the main
 * method of this class is executed, the Java Spring server will run.
 */
@SpringBootApplication
public class Application {
	/**
	 * The entry point of this Java application.
	 *
	 * @param args the command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
