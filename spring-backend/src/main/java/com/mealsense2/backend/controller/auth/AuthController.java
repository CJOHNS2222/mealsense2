package com.mealsense2.backend.controller.auth;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        // Placeholder: implement authentication logic
        return "Logged in as: " + email;
    }

    @PostMapping("/register")
    public String register(@RequestParam String email, @RequestParam String password) {
        // Placeholder: implement registration logic
        return "Registered: " + email;
    }
}
