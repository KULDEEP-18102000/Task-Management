package com.taskmanagement.dto.request;

import com.taskmanagement.entity.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateRequest {
    private Role role; // Expecting "ADMIN", "MANAGER", or "USER"
}