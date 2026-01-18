package com.taskmanagement.service;

import com.taskmanagement.dto.request.ProjectRequest;
import com.taskmanagement.dto.response.ProjectResponse;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.repository.ProjectRepository;
import com.taskmanagement.repository.TaskRepository;
import com.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User currentUser) {
        List<Project> projects;
        
        // Admins can see all projects
        if (currentUser.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            // Managers and Users see only projects they own or are members of
            projects = projectRepository.findAllAccessibleProjects(currentUser);
        }
        
        return projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // Check authorization
        checkProjectAccess(project, currentUser);
        
        return mapToResponse(project);
    }
    
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User currentUser) {
        // Only Admins and Managers can create projects
        if (currentUser.getRole() == Role.USER) {
            throw new UnauthorizedException("Only Admins and Managers can create projects");
        }
        
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .members(new HashSet<>())
                .build();
        
        // Assign manager
        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
            
            // Validate manager role
            if (manager.getRole() != Role.ADMIN && manager.getRole() != Role.MANAGER) {
                throw new UnauthorizedException("Only Admins or Managers can be assigned as project managers");
            }
            
            project.setManager(manager);
        } else {
            // If no manager specified, creator becomes the manager
            project.setManager(currentUser);
        }
        
        // Add team members if provided
        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>();
            for (Long memberId : request.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            project.setMembers(members);
        }
        
        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }
    
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // Only Admin or Project Owner can update
        checkProjectOwnership(project, currentUser);
        
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        
        // Update manager if provided
        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));
            
            // Validate manager role
            if (manager.getRole() != Role.ADMIN && manager.getRole() != Role.MANAGER) {
                throw new UnauthorizedException("Only Admins or Managers can be assigned as project managers");
            }
            
            project.setManager(manager);
        }
        
        // Update team members if provided
        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>();
            for (Long memberId : request.getMemberIds()) {
                User member = userRepository.findById(memberId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + memberId));
                members.add(member);
            }
            project.setMembers(members);
        }
        
        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }
    
    @Transactional
    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // Only Admin or Project Owner can delete
        checkProjectOwnership(project, currentUser);
        
        projectRepository.delete(project);
    }
    
    @Transactional
    public ProjectResponse addMember(Long projectId, Long userId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        // Only Admin or Project Owner can add members
        checkProjectOwnership(project, currentUser);
        
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        project.getMembers().add(member);
        Project updatedProject = projectRepository.save(project);
        
        return mapToResponse(updatedProject);
    }
    
    @Transactional
    public ProjectResponse removeMember(Long projectId, Long userId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        // Only Admin or Project Owner can remove members
        checkProjectOwnership(project, currentUser);
        
        User member = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        project.getMembers().remove(member);
        Project updatedProject = projectRepository.save(project);
        
        return mapToResponse(updatedProject);
    }
    
    // Helper methods
    private void checkProjectAccess(Project project, User user) {
        if (user.getRole() == Role.ADMIN) {
            return; // Admins have access to all projects
        }
        
        boolean hasAccess = project.getOwner().getId().equals(user.getId()) ||
                           project.getMembers().contains(user);
        
        if (!hasAccess) {
            throw new UnauthorizedException("You don't have access to this project");
        }
    }
    
    private void checkProjectOwnership(Project project, User user) {
        if (user.getRole() == Role.ADMIN) {
            return; // Admins can modify any project
        }
        
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedException("Only the project owner can perform this action");
        }
    }
    
    private ProjectResponse mapToResponse(Project project) {
        // Count tasks in project
        int taskCount = taskRepository.findByProjectOrderByCreatedAtDesc(project).size();
        
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(mapUserToSummary(project.getOwner()))
                .manager(project.getManager() != null ? mapUserToSummary(project.getManager()) : null)
                .members(project.getMembers().stream()
                        .map(this::mapUserToSummary)
                        .collect(Collectors.toSet()))
                .taskCount(taskCount)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
    
    private ProjectResponse.UserSummary mapUserToSummary(User user) {
        return ProjectResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
