package com.taskmanagement.controller;

import com.taskmanagement.dto.response.ActivityResponse;
import com.taskmanagement.entity.User;
import com.taskmanagement.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {
    
    private final ActivityService activityService;
    
    @GetMapping("/recent")
    public ResponseEntity<List<ActivityResponse>> getRecentActivities(
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(activityService.getRecentActivities(limit));
    }
    
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<ActivityResponse>> getTaskActivities(@PathVariable Long taskId) {
        return ResponseEntity.ok(activityService.getTaskActivities(taskId));
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ActivityResponse>> getProjectActivities(@PathVariable Long projectId) {
        return ResponseEntity.ok(activityService.getProjectActivities(projectId));
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(activityService.getUserActivities(user.getId(), limit));
    }
}
