package com.taskmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private Long id;
    private String type;
    private String description;
    private UserSummary user;
    private TaskSummary task;
    private ProjectSummary project;
    private LocalDateTime createdAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String username;
        private String fullName;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskSummary {
        private Long id;
        private String title;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectSummary {
        private Long id;
        private String name;
    }
}
