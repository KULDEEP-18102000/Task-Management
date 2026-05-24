package com.taskmanagement.controller;

import com.taskmanagement.dto.request.RoleUpdateRequest;
import com.taskmanagement.dto.response.ProjectResponse;
import com.taskmanagement.dto.response.UserResponse;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<List<ProjectResponse.UserSummary>> getUsersForAssignment(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getAvailableUsers(user));
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

    @GetMapping("/management")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsersForManagement() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    // Only admins can change a user's role
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request) {

        userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok().build();
    }
}
