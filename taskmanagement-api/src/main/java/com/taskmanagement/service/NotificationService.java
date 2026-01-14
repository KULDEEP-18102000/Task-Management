package com.taskmanagement.service;

import com.taskmanagement.dto.response.NotificationResponse;
import com.taskmanagement.dto.websocket.NotificationMessage;
import com.taskmanagement.entity.Notification;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public void createNotification(
            User user,
            String title,
            String message,
            Notification.NotificationType type,
            Task task,
            Project project
    ) {
        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .user(user)
                .task(task)
                .project(project)
                .isRead(false)
                .build();
        
        Notification saved = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        NotificationMessage wsMessage = NotificationMessage.builder()
                .notificationId(saved.getId())
                .userId(user.getId())
                .title(title)
                .message(message)
                .type(type.name())
                .build();
        
        messagingTemplate.convertAndSend("/topic/user/" + user.getId() + "/notifications", wsMessage);
    }
    
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }
    
    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only mark your own notifications as read");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    private NotificationResponse mapToResponse(Notification notification) {
        NotificationResponse.NotificationResponseBuilder builder = NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt());
        
        if (notification.getTask() != null) {
            builder.task(NotificationResponse.TaskSummary.builder()
                    .id(notification.getTask().getId())
                    .title(notification.getTask().getTitle())
                    .build());
        }
        
        if (notification.getProject() != null) {
            builder.project(NotificationResponse.ProjectSummary.builder()
                    .id(notification.getProject().getId())
                    .name(notification.getProject().getName())
                    .build());
        }
        
        return builder.build();
    }
}
