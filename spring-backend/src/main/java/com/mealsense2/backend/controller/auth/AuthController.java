package com.mealsense2.backend.controller.auth;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow CORS for React dev server
public class AuthController {
    
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        // Placeholder: implement authentication logic
        return Map.of("status", "success", "message", "Logged in as: " + email);
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        // Placeholder: implement registration logic
        return Map.of("status", "success", "message", "Registered: " + email);
    }
}
