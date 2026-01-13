package com.taskmanagement.entity;

public enum Role {
    ADMIN,    // Can manage everything
    MANAGER,  // Can manage projects and teams
    USER      // Can only view/edit assigned tasks
}
