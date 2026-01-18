package com.taskmanagement.repository;

import com.taskmanagement.entity.Activity;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    // Get recent activities (limit to last 50)
    List<Activity> findTop50ByOrderByCreatedAtDesc();
    
    // Get activities for a task
    List<Activity> findByTaskOrderByCreatedAtDesc(Task task);
    
    // Get activities for a project
    List<Activity> findByProjectOrderByCreatedAtDesc(Project project);
    
    // Get activities for a specific task by ID
    List<Activity> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    // Get activities for a specific project by ID
    List<Activity> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    
    // Get user's recent activities
    @Query("SELECT a FROM Activity a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    List<Activity> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
    
    // Set task_id to null for all activities related to a task (preserve history)
    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Activity a SET a.task = null WHERE a.task.id = :taskId")
    void setTaskIdToNullForTask(@Param("taskId") Long taskId);
}
