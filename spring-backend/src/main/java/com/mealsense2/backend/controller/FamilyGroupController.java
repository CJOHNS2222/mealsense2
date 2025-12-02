package com.mealsense2.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/family")
public class FamilyGroupController {
    @GetMapping
    public List<String> listGroups() {
        // Placeholder: return dummy group names
        return Arrays.asList("Smith Family", "Johnson Family");
    }

    @PostMapping
    public String createGroup(@RequestParam String name) {
        // Placeholder: create group logic
        return "Created group: " + name;
    }

    @PostMapping("/join")
    public String joinGroup(@RequestParam String groupId) {
        // Placeholder: join group logic
        return "Joined group: " + groupId;
    }

    @PostMapping("/leave")
    public String leaveGroup(@RequestParam String groupId) {
        // Placeholder: leave group logic
        return "Left group: " + groupId;
    }
}
