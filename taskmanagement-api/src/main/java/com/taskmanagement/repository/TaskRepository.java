package com.taskmanagement.repository;

import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Task;
import com.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find tasks created by user
    List<Task> findByCreatedByOrderByCreatedAtDesc(User createdBy);
    
    // Find tasks assigned to user
    List<Task> findByAssignedToOrderByCreatedAtDesc(User assignedTo);
    
    // Find tasks in a project
    List<Task> findByProjectOrderByCreatedAtDesc(Project project);
    
    // Find all tasks user has access to (created by or assigned to)
    @Query("SELECT t FROM Task t WHERE t.createdBy = :user OR t.assignedTo = :user ORDER BY t.createdAt DESC")
    List<Task> findAllAccessibleTasks(@Param("user") User user);
    
    // Find task by id and check if user has access
    @Query("SELECT t FROM Task t WHERE t.id = :taskId AND (t.createdBy = :user OR t.assignedTo = :user)")
    Optional<Task> findByIdAndUserAccess(@Param("taskId") Long taskId, @Param("user") User user);
    
    // Find tasks by project and user access
    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId AND (t.createdBy = :user OR t.assignedTo = :user) ORDER BY t.createdAt DESC")
    List<Task> findByProjectIdAndUserAccess(@Param("projectId") Long projectId, @Param("user") User user);
}