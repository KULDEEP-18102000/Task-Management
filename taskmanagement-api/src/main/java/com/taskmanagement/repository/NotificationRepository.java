package com.taskmanagement.repository;

import com.taskmanagement.entity.Notification;
import com.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Get all notifications for a user
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    // Get unread notifications for a user
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    // Count unread notifications
    long countByUserAndIsReadFalse(User user);
}
