package com.taskmanagement.service;

import com.taskmanagement.dto.request.CommentRequest;
import com.taskmanagement.dto.response.CommentResponse;
import com.taskmanagement.entity.Comment;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.CommentRepository;
import com.taskmanagement.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentResponse createComment(Long taskId, CommentRequest request, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        
        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .user(user)
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        
        // Log activity
        activityService.logActivity(
            com.taskmanagement.entity.Activity.ActivityType.COMMENT_ADDED,
            user.getFullName() + " commented on task: " + task.getTitle(),
            user,
            task,
            task.getProject()
        );
        
        // Send notification to task assignee if different from commenter
        if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(user.getId())) {
            notificationService.createNotification(
                task.getAssignedTo(),
                "New Comment",
                user.getFullName() + " commented on your task: " + task.getTitle(),
                com.taskmanagement.entity.Notification.NotificationType.COMMENT_ADDED,
                task,
                null
            );
        }
        
        // Send real-time update via WebSocket
        CommentResponse response = mapToResponse(savedComment);
        messagingTemplate.convertAndSend("/topic/task/" + taskId + "/comments", response);
        
        return response;
    }
    
    @Transactional
    public void deleteComment(Long id, User user) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        
        // Only comment owner can delete
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }
    
    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(CommentResponse.UserSummary.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .fullName(comment.getUser().getFullName())
                        .build())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
