package com.taskmanagement.service;

import com.taskmanagement.dto.response.ActivityResponse;
import com.taskmanagement.entity.Activity;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    
    @Transactional
    public void logActivity(Activity.ActivityType type, String description, User user, Task task, Project project) {
        Activity activity = Activity.builder()
                .type(type)
                .description(description)
                .user(user)
                .task(task)
                .project(project)
                .build();
        
        activityRepository.save(activity);
    }
    
    @Transactional(readOnly = true)
    public List<ActivityResponse> getRecentActivities(int limit) {
        return activityRepository.findTop50ByOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ActivityResponse> getTaskActivities(Long taskId) {
        return activityRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ActivityResponse> getProjectActivities(Long projectId) {
        return activityRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ActivityResponse> getUserActivities(Long userId, int limit) {
        return activityRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse.ActivityResponseBuilder builder = ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().name())
                .description(activity.getDescription())
                .createdAt(activity.getCreatedAt());
        
        if (activity.getUser() != null) {
            builder.user(ActivityResponse.UserSummary.builder()
                    .id(activity.getUser().getId())
                    .username(activity.getUser().getUsername())
                    .fullName(activity.getUser().getFullName())
                    .build());
        }
        
        if (activity.getTask() != null) {
            builder.task(ActivityResponse.TaskSummary.builder()
                    .id(activity.getTask().getId())
                    .title(activity.getTask().getTitle())
                    .build());
        }
        
        if (activity.getProject() != null) {
            builder.project(ActivityResponse.ProjectSummary.builder()
                    .id(activity.getProject().getId())
                    .name(activity.getProject().getName())
                    .build());
        }
        
        return builder.build();
    }
}
