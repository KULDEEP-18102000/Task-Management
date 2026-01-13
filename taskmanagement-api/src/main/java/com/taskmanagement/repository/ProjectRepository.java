package com.taskmanagement.repository;

import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    // Find projects owned by user
    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);
    
    // Find projects where user is a member
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m = :user ORDER BY p.createdAt DESC")
    List<Project> findByMembersContainingOrderByCreatedAtDesc(@Param("user") User user);
    
    // Find all projects user has access to (owner or member)
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner = :user OR m = :user ORDER BY p.createdAt DESC")
    List<Project> findAllAccessibleProjects(@Param("user") User user);
    
    // Check if user is project member or owner
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Project p LEFT JOIN p.members m WHERE p.id = :projectId AND (p.owner = :user OR m = :user)")
    boolean isUserAuthorized(@Param("projectId") Long projectId, @Param("user") User user);
    
    Optional<Project> findByIdAndOwner(Long id, User owner);
}
