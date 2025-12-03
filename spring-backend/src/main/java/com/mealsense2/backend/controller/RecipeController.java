package com.mealsense2.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*") // Allow CORS for React dev server
public class RecipeController {
    @GetMapping
    public List<String> listRecipes() {
        // Placeholder: return dummy recipes
        return Arrays.asList("Spaghetti Bolognese", "Chicken Alfredo");
    }

    @PostMapping
    public String addRecipe(@RequestParam String name) {
        // Placeholder: add recipe logic
        return "Added recipe: " + name;
    }
}
