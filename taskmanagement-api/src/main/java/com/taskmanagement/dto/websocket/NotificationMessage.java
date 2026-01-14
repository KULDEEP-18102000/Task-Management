package com.taskmanagement.dto.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {
    private Long notificationId;
    private Long userId;
    private String title;
    private String message;
    private String type;
}
