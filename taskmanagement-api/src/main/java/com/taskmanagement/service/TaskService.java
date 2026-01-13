package com.taskmanagement.service;

import com.taskmanagement.dto.request.TaskRequest;
import com.taskmanagement.dto.response.TaskResponse;
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
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(User currentUser) {
        List<Task> tasks;
        
        // Admins can see all tasks
        if (currentUser.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            // Users and Managers see tasks they created or are assigned to
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
        
        // Check if user has access to this project
        checkProjectAccess(project, currentUser);
        
        List<Task> tasks;
        if (currentUser.getRole() == Role.ADMIN || 
            project.getOwner().getId().equals(currentUser.getId())) {
            // Admins and project owners see all tasks in project
            tasks = taskRepository.findByProjectOrderByCreatedAtDesc(project);
        } else {
            // Regular members see only their tasks
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
        
        // Set project if provided
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            
            // Check if user has access to this project
            checkProjectAccess(project, currentUser);
            task.setProject(project);
        }
        
        // Set assigned user if provided
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            
            // Verify assigned user has access to the project
            if (task.getProject() != null) {
                checkProjectMembership(task.getProject(), assignedUser);
            }
            
            task.setAssignedTo(assignedUser);
        } else {
            // If no assignee specified, assign to creator
            task.setAssignedTo(currentUser);
        }
        
        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }
    
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = findTaskWithAccess(id, currentUser);
        
        // Check if user can update this task
        checkTaskUpdatePermission(task, currentUser);
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        
        // Update project if provided
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            checkProjectAccess(project, currentUser);
            task.setProject(project);
        }
        
        // Update assigned user if provided
        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            
            if (task.getProject() != null) {
                checkProjectMembership(task.getProject(), assignedUser);
            }
            
            task.setAssignedTo(assignedUser);
        }
        
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }
    
    @Transactional
    public void deleteTask(Long id, User currentUser) {
        Task task = findTaskWithAccess(id, currentUser);
        
        // Only task creator, project owner, or admin can delete
        if (currentUser.getRole() != Role.ADMIN &&
            !task.getCreatedBy().getId().equals(currentUser.getId()) &&
            (task.getProject() == null || !task.getProject().getOwner().getId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("You don't have permission to delete this task");
        }
        
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
        
        // Task creator, assigned user, or project owner can update
        boolean canUpdate = task.getCreatedBy().getId().equals(user.getId()) ||
                           (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId())) ||
                           (task.getProject() != null && task.getProject().getOwner().getId().equals(user.getId()));
        
        if (!canUpdate) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }
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