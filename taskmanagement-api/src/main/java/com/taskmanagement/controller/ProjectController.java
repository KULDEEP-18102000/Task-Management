package com.taskmanagement.controller;

import com.taskmanagement.dto.request.ProjectRequest;
import com.taskmanagement.dto.response.ProjectResponse;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAllProjects(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.getProjectById(id, user));
    }
    
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, user));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, request, user));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        projectService.deleteProject(id, user);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ProjectResponse> addMember(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.addMember(projectId, userId, user));
    }
    
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ProjectResponse> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(projectService.removeMember(projectId, userId, user));
    }
}
