package com.pdd.photoprint.photo.controllers;

import java.util.concurrent.atomic.AtomicLong;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class GreetingController {

    private static final String template = "Hello, %s!";

    private final AtomicLong counter = new AtomicLong();
    @CrossOrigin(origins = "*")
    @GetMapping("/greeting")
    public Greeting greeting(@RequestParam(required = false, defaultValue = "World") String name) {
        System.out.println("==== get greeting ====");
        log.info("get greetin --------------");
        log.warn("got greeting warning --------------");
        log.error("got greeting error --------------ss");

        return new Greeting(counter.incrementAndGet(), String.format(template, name));
    }

}
