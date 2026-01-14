package com.taskmanagement.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskUpdateMessage {
    private String type;  // CREATED, UPDATED, DELETED
    private Long taskId;
    private Long projectId;
    private String message;
    private Object data;  // Task data
}
