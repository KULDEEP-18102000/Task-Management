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
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private boolean isRead;
    private TaskSummary task;
    private ProjectSummary project;
    private LocalDateTime createdAt;
    
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
