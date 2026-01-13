package com.taskmanagement.dto.request;

import com.taskmanagement.entity.Task.TaskPriority;
import com.taskmanagement.entity.Task.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private TaskStatus status;

    private TaskPriority priority;  // NEW

    private LocalDate dueDate;  // NEW

    private Long projectId;  // NEW: Associated project

    private Long assignedToId;  // NEW: Assigned user
}