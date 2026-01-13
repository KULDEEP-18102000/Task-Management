package com.taskmanagement.controller;

import com.taskmanagement.dto.response.ProjectResponse;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<ProjectResponse.UserSummary>> getAllUsers(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getAllUsers(user));
    }
    
    @GetMapping("/team-members")
    public ResponseEntity<List<ProjectResponse.UserSummary>> getTeamMembers(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getTeamMembers(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse.UserSummary> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(userService.getUserById(id, user));
    }
    
    @PutMapping("/{id}/role")
    public ResponseEntity<ProjectResponse.UserSummary> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User user
    ) {
        Role newRole = Role.valueOf(request.get("role"));
        return ResponseEntity.ok(userService.updateUserRole(id, newRole, user));
    }
}
