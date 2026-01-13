package com.taskmanagement.service;

import com.taskmanagement.dto.response.ProjectResponse;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.User;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.exception.UnauthorizedException;
import com.taskmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    @Transactional(readOnly = true)
    public List<ProjectResponse.UserSummary> getAllUsers(User currentUser) {
        // Only Admins and Managers can view all users
        if (currentUser.getRole() == Role.USER) {
            throw new UnauthorizedException("You don't have permission to view all users");
        }
        
        return userRepository.findAll().stream()
                .map(this::mapToUserSummary)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProjectResponse.UserSummary> getTeamMembers(User currentUser) {
        // Get all users except current user (for team assignment)
        return userRepository.findByIdNot(currentUser.getId()).stream()
                .map(this::mapToUserSummary)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProjectResponse.UserSummary getUserById(Long id, User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        return mapToUserSummary(user);
    }
    
    @Transactional
    public ProjectResponse.UserSummary updateUserRole(Long id, Role newRole, User currentUser) {
        // Only Admins can change roles
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only Admins can change user roles");
        }
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Don't allow changing own role
        if (user.getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot change your own role");
        }
        
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        return mapToUserSummary(updatedUser);
    }
    
    private ProjectResponse.UserSummary mapToUserSummary(User user) {
        return ProjectResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
