package com.taskmanagement.service;

import com.taskmanagement.dto.request.TaskRequest;
import com.taskmanagement.dto.response.TaskResponse;
import com.taskmanagement.dto.websocket.TaskUpdateMessage;
import com.taskmanagement.entity.Activity;
import com.taskmanagement.entity.Notification;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.repository.ProjectRepository;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;  // NEW: WebSocket
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(User currentUser) {
        List<Task> tasks;
        
        if (currentUser.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findAllAccessibleTasks(currentUser);
        }
        
        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByProject(Long projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        checkProjectAccess(project, currentUser);
        
        List<Task> tasks;
        if (currentUser.getRole() == Role.ADMIN || 
            project.getOwner().getId().equals(currentUser.getId())) {
            tasks = taskRepository.findByProjectOrderByCreatedAtDesc(project);
        } else {
            tasks = taskRepository.findByProjectIdAndUserAccess(projectId, currentUser);
        }
        
        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, User currentUser) {
        Task task = findTaskWithAccess(id, currentUser);
        return mapToResponse(task);
    }
    
    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : Task.TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Task.TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .createdBy(currentUser)
                .build();
        
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            checkProjectAccess(project, currentUser);
            task.setProject(project);
        }
        
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            
            if (task.getProject() != null) {
                checkProjectMembership(task.getProject(), assignedUser);
            }
            
            task.setAssignedTo(assignedUser);
            
            // Send notification to assigned user
            if (!assignedUser.getId().equals(currentUser.getId())) {
                notificationService.createNotification(
                    assignedUser,
                    "New Task Assigned",
                    currentUser.getFullName() + " assigned you a task: " + task.getTitle(),
                    Notification.NotificationType.TASK_ASSIGNED,
                    task,
                    task.getProject()
                );
            }
        } else {
            task.setAssignedTo(currentUser);
        }
        
        Task savedTask = taskRepository.save(task);
        
        // Log activity
        activityService.logActivity(
            Activity.ActivityType.TASK_CREATED,
            currentUser.getFullName() + " created task: " + savedTask.getTitle(),
            currentUser,
            savedTask,
            savedTask.getProject()
        );
        
        // Send WebSocket update
        TaskResponse response = mapToResponse(savedTask);
        sendTaskUpdate("CREATED", savedTask, response);
        
        return response;
    }
    
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = findTaskWithAccess(id, currentUser);
        checkTaskUpdatePermission(task, currentUser);
        
        // Track changes for activity log
        StringBuilder changes = new StringBuilder();
        boolean hasChanges = false;
        
        if (!task.getTitle().equals(request.getTitle())) {
            changes.append("Title changed. ");
            hasChanges = true;
            task.setTitle(request.getTitle());
        }
        
        if (request.getDescription() != null && !request.getDescription().equals(task.getDescription())) {
            changes.append("Description updated. ");
            hasChanges = true;
            task.setDescription(request.getDescription());
        }
        
        if (!task.getPriority().equals(request.getPriority())) {
            changes.append("Priority changed to ").append(request.getPriority()).append(". ");
            hasChanges = true;
            task.setPriority(request.getPriority());
        }
        
        if (request.getStatus() != null && !task.getStatus().equals(request.getStatus())) {
            Task.TaskStatus oldStatus = task.getStatus();
            task.setStatus(request.getStatus());
            changes.append("Status changed from ").append(oldStatus).append(" to ").append(request.getStatus()).append(". ");
            hasChanges = true;
            
            // If task completed, log specific activity
            if (request.getStatus() == Task.TaskStatus.COMPLETED) {
                activityService.logActivity(
                    Activity.ActivityType.TASK_COMPLETED,
                    currentUser.getFullName() + " completed task: " + task.getTitle(),
                    currentUser,
                    task,
                    task.getProject()
                );
            }
        }
        
        if (request.getDueDate() != null && !request.getDueDate().equals(task.getDueDate())) {
            changes.append("Due date updated. ");
            hasChanges = true;
            task.setDueDate(request.getDueDate());
        }
        
        // Update project
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            checkProjectAccess(project, currentUser);
            
            if (task.getProject() == null || !task.getProject().getId().equals(project.getId())) {
                changes.append("Moved to project: ").append(project.getName()).append(". ");
                hasChanges = true;
                task.setProject(project);
            }
        }
        
        // Update assigned user
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            
            if (task.getProject() != null) {
                checkProjectMembership(task.getProject(), assignedUser);
            }
            
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(assignedUser.getId())) {
                changes.append("Reassigned to ").append(assignedUser.getFullName()).append(". ");
                hasChanges = true;
                task.setAssignedTo(assignedUser);
                
                // Send notification to newly assigned user
                if (!assignedUser.getId().equals(currentUser.getId())) {
                    notificationService.createNotification(
                        assignedUser,
                        "Task Assigned",
                        currentUser.getFullName() + " assigned you a task: " + task.getTitle(),
                        Notification.NotificationType.TASK_ASSIGNED,
                        task,
                        task.getProject()
                    );
                }
            }
        }
        
        Task updatedTask = taskRepository.save(task);
        
        // Log activity if there were changes
        if (hasChanges) {
            activityService.logActivity(
                Activity.ActivityType.TASK_UPDATED,
                currentUser.getFullName() + " updated task: " + task.getTitle() + " - " + changes.toString(),
                currentUser,
                updatedTask,
                updatedTask.getProject()
            );
            
            // Send notification to assignee if different from updater
            if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(currentUser.getId())) {
                notificationService.createNotification(
                    task.getAssignedTo(),
                    "Task Updated",
                    currentUser.getFullName() + " updated task: " + task.getTitle(),
                    Notification.NotificationType.TASK_UPDATED,
                    task,
                    task.getProject()
                );
            }
        }
        
        // Send WebSocket update
        TaskResponse response = mapToResponse(updatedTask);
        sendTaskUpdate("UPDATED", updatedTask, response);
        
        return response;
    }
    
    @Transactional
    public void deleteTask(Long id, User currentUser) {
        Task task = findTaskWithAccess(id, currentUser);
        
        if (currentUser.getRole() != Role.ADMIN &&
            !task.getCreatedBy().getId().equals(currentUser.getId()) &&
            (task.getProject() == null || !task.getProject().getOwner().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("You don't have permission to delete this task");
        }
        
        // Log activity before deletion
        activityService.logActivity(
            Activity.ActivityType.TASK_DELETED,
            currentUser.getFullName() + " deleted task: " + task.getTitle(),
            currentUser,
            null,  // Task will be deleted
            task.getProject()
        );
        
        // Send WebSocket update before deletion
        sendTaskUpdate("DELETED", task, null);
        
        taskRepository.delete(task);
    }
    
    // Helper methods
    private Task findTaskWithAccess(Long taskId, User user) {
        if (user.getRole() == Role.ADMIN) {
            return taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        }
        
        return taskRepository.findByIdAndUserAccess(taskId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found or access denied"));
    }
    
    private void checkProjectAccess(Project project, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        
        boolean hasAccess = project.getOwner().getId().equals(user.getId()) ||
                           project.getMembers().contains(user);
        
        if (!hasAccess) {
            throw new UnauthorizedException("You don't have access to this project");
        }
    }
    
    private void checkProjectMembership(Project project, User user) {
        boolean isMember = project.getOwner().getId().equals(user.getId()) ||
                          project.getMembers().contains(user);
        
        if (!isMember) {
            throw new UnauthorizedException("User is not a member of this project");
        }
    }
    
    private void checkTaskUpdatePermission(Task task, User user) {
        if (user.getRole() == Role.ADMIN) {
            return;
        }
        
        boolean canUpdate = task.getCreatedBy().getId().equals(user.getId()) ||
                           (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId())) ||
                           (task.getProject() != null && task.getProject().getOwner().getId().equals(user.getId()));
        
        if (!canUpdate) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }
    }
    
    private void sendTaskUpdate(String type, Task task, TaskResponse data) {
        TaskUpdateMessage message = TaskUpdateMessage.builder()
                .type(type)
                .taskId(task.getId())
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .message(type + " task: " + task.getTitle())
                .data(data)
                .build();
        
        // Send to project channel
        if (task.getProject() != null) {
            messagingTemplate.convertAndSend("/topic/project/" + task.getProject().getId() + "/tasks", message);
        }
        
        // Send to general tasks channel
        messagingTemplate.convertAndSend("/topic/tasks", message);
    }
    
    private TaskResponse mapToResponse(Task task) {
        TaskResponse.TaskResponseBuilder builder = TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt());
        
        if (task.getProject() != null) {
            builder.project(TaskResponse.ProjectSummary.builder()
                    .id(task.getProject().getId())
                    .name(task.getProject().getName())
                    .build());
        }
        
        if (task.getCreatedBy() != null) {
            builder.createdBy(TaskResponse.UserSummary.builder()
                    .id(task.getCreatedBy().getId())
                    .username(task.getCreatedBy().getUsername())
                    .fullName(task.getCreatedBy().getFullName())
                    .build());
        }
        
        if (task.getAssignedTo() != null) {
            builder.assignedTo(TaskResponse.UserSummary.builder()
                    .id(task.getAssignedTo().getId())
                    .username(task.getAssignedTo().getUsername())
                    .fullName(task.getAssignedTo().getFullName())
                    .build());
        }
        
        return builder.build();
    }
}