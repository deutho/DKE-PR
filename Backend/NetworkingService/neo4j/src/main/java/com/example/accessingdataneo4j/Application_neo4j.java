package com.example.accessingdataneo4j;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Collections;

@SpringBootApplication
public class Application_neo4j {
    //public static void main (String[] args){
        //SpringApplication.run(Application_neo4j.class, args);
    //}
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application_neo4j.class);
        app.setDefaultProperties(Collections
                .singletonMap("server.port", "8083"));
        app.run(args);
    }
}
