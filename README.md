# Task Management System - Complete Project Documentation

**A Full-Stack Real-Time Collaborative Task Management Application**

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.x-brightgreen?style=flat&logo=spring)
![React](https://img.shields.io/badge/React-18+-blue?style=flat&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?style=flat&logo=mysql)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-yellow?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Features & Functionality](#-features--functionality)
5. [Database Design](#-database-design)
6. [Backend Implementation](#-backend-implementation)
7. [Frontend Implementation](#-frontend-implementation)
8. [Real-Time Features](#-real-time-features)
9. [Security Implementation](#-security-implementation)
10. [API Documentation](#-api-documentation)
11. [Development Phases](#-development-phases)
12. [Setup & Installation](#-setup--installation)
13. [Testing Guide](#-testing-guide)
14. [Deployment Guide](#-deployment-guide)
15. [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

### What is This Application?

The **Task Management System** is a modern, full-stack web application designed to help teams and individuals manage tasks, projects, and collaborate in real-time. Think of it as a combination of **Trello** (task boards), **Asana** (project management), and **Slack** (real-time collaboration).

### Key Highlights

- ✅ **Real-time Collaboration**: See updates instantly without refreshing the page
- ✅ **Role-Based Access**: Different permissions for Admins, Managers, and Users
- ✅ **Team Management**: Organize work into projects with team members
- ✅ **Activity Tracking**: Complete audit trail of all actions
- ✅ **Notifications**: In-app notifications for important events
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Target Users

- **Individual Users**: Personal task management
- **Teams**: Collaborative project management
- **Organizations**: Multi-team task tracking with role-based access

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React SPA (Single Page Application)                   │ │
│  │  - Redux (State Management)                            │ │
│  │  - React Router (Navigation)                           │ │
│  │  - Tailwind CSS (Styling)                              │ │
│  │  - WebSocket Client (Real-time)                        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS + WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Spring Boot Application                               │ │
│  │  ┌──────────────┬──────────────┬──────────────┐       │ │
│  │  │ Controllers  │  Services    │  Security    │       │ │
│  │  │ (REST API)   │  (Business)  │  (JWT Auth)  │       │ │
│  │  └──────────────┴──────────────┴──────────────┘       │ │
│  │  ┌──────────────────────────────────────────┐         │ │
│  │  │  WebSocket Server (STOMP over SockJS)    │         │ │
│  │  └──────────────────────────────────────────┘         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ JDBC
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MySQL Database                                        │ │
│  │  - Users                  - Projects                   │ │
│  │  - Tasks                  - Comments                   │ │
│  │  - Activities             - Notifications              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

**1. REST API Communication:**
```
User Action → React Component → Redux Action → API Service → 
Axios HTTP Request → Spring Boot Controller → Service Layer → 
Repository → Database → Response Back to Client
```

**2. WebSocket Communication:**
```
Server Event → WebSocket Server → STOMP Broker → 
Subscribed Clients → Redux Store Update → UI Re-render
```

### Design Patterns Used

- **MVC Pattern (Backend)**
  - Model: Entities (User, Task, Project)
  - View: REST API responses (DTOs)
  - Controller: REST Controllers

- **Repository Pattern (Backend)**
  - Data access abstraction through JPA repositories

- **Service Layer Pattern (Backend)**
  - Business logic separated from controllers

- **Redux Pattern (Frontend)**
  - Centralized state management
  - Unidirectional data flow

- **Component-Based Architecture (Frontend)**
  - Reusable UI components

---

## 💻 Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Programming language |
| Spring Boot | 3.2.x | Application framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | Database ORM |
| MySQL | 8.0+ | Relational database |
| JWT (JJWT) | 0.12.3 | Token-based authentication |
| WebSocket | STOMP/SockJS | Real-time communication |
| Lombok | 1.18.x | Reduce boilerplate code |
| Maven | 3.8+ | Build & dependency management |

**Why These Choices?**
- **Spring Boot**: Industry-standard, production-ready, comprehensive ecosystem
- **MySQL**: Reliable, well-documented, ACID compliant
- **JWT**: Stateless authentication, scalable, mobile-friendly
- **WebSocket**: True bidirectional real-time communication

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI framework |
| Vite | 5.x | Build tool & dev server |
| Redux Toolkit | 2.x | State management |
| React Router | 6.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Axios | 1.6+ | HTTP client |
| SockJS + STOMP | Latest | WebSocket client |
| React Hot Toast | 2.x | Toast notifications |
| Lucide React | Latest | Icon library |

**Why These Choices?**
- **React**: Component-based, virtual DOM, massive ecosystem
- **Vite**: Lightning-fast dev server, optimized builds
- **Redux Toolkit**: Simplified Redux with built-in best practices
- **Tailwind CSS**: Rapid UI development, consistent design
- **WebSocket**: Real-time updates without polling

### Development Tools

- **IDE**: IntelliJ IDEA (Backend), VS Code (Frontend)
- **API Testing**: Postman
- **Version Control**: Git
- **Package Managers**: Maven (Backend), npm (Frontend)

---

## ✨ Features & Functionality

### 1. User Management

#### Registration & Authentication
- Users can register with username, email, full name, and password
- Passwords are encrypted using BCrypt (industry-standard)
- Login returns a JWT token valid for 24 hours
- Token contains user information and role

#### User Roles & Permissions

| Role | Capabilities |
|------|--------------|
| **ADMIN** | • Full system access<br>• Manage all projects<br>• Manage all tasks<br>• Change user roles<br>• View all activities |
| **MANAGER** | • Create projects<br>• Manage own projects<br>• Add/remove team members<br>• View team activities<br>• Assign tasks |
| **USER** | • View assigned tasks<br>• Update own tasks<br>• Comment on tasks<br>• View project activities |

### 2. Project Management

#### Project Features
- **Create Projects**: Managers and Admins can create projects
- **Team Assignment**: Add multiple team members to projects
- **Project Ownership**: Project creator is the owner
- **Access Control**: Only members can view project tasks
- **Project Details**:
  - Name (required)
  - Description (optional)
  - Owner information
  - Team members list
  - Task count
  - Creation/update timestamps

#### Project Operations
```
Create Project → Add Team Members → Create Tasks → Assign Tasks → Track Progress
```

### 3. Task Management

#### Task Properties

| Property | Type | Description |
|----------|------|-------------|
| Title | String (max 100) | Task name |
| Description | String (max 1000) | Detailed description |
| Status | Enum | TODO, IN_PROGRESS, COMPLETED |
| Priority | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| Due Date | Date | Optional deadline |
| Project | Reference | Associated project (optional) |
| Created By | User | Task creator |
| Assigned To | User | Assignee (optional) |

#### Task Lifecycle
```
Create → Assign → In Progress → Review → Complete
                ↓
         Update Status/Priority
                ↓
         Add Comments/Activities
```

#### Task Filtering
- By Status (All, To Do, In Progress, Completed)
- By Project
- By Assignee
- By Priority (future enhancement)
- By Due Date (future enhancement)

### 4. Real-Time Collaboration

#### WebSocket Channels

| Channel | Purpose | Subscribers |
|---------|---------|-------------|
| `/topic/tasks` | Global task updates | All authenticated users |
| `/topic/project/{id}/tasks` | Project-specific updates | Project members |
| `/topic/task/{id}/comments` | Task comments | Users viewing task |
| `/topic/user/{id}/notifications` | User notifications | Individual user |

#### Real-Time Events
- ✅ **Task Created**: Instant appearance in all connected clients
- ✅ **Task Updated**: Live status/priority changes
- ✅ **Task Deleted**: Immediate removal from UI
- ✅ **Comment Added**: Real-time comment feed
- ✅ **Notification Sent**: Instant notification delivery

### 5. Comments System

#### Comment Features
- **Add Comments**: Any user with task access
- **Delete Comments**: Only comment owner
- **Real-Time Updates**: Comments appear instantly
- **User Attribution**: Shows commenter name and timestamp
- **Character Limit**: 2000 characters

#### Comment Use Cases
- Task clarification
- Progress updates
- Collaboration discussions
- Decision documentation

### 6. Activity Tracking

#### Activity Types Logged

| Activity Type | Description |
|---------------|-------------|
| TASK_CREATED | New task created |
| TASK_UPDATED | Task properties changed |
| TASK_DELETED | Task removed |
| TASK_ASSIGNED | Task assigned to user |
| TASK_COMPLETED | Task marked complete |
| COMMENT_ADDED | Comment posted |
| PROJECT_CREATED | New project created |
| PROJECT_UPDATED | Project modified |
| MEMBER_ADDED | User added to project |
| MEMBER_REMOVED | User removed from project |

#### Activity Feeds
- **Global Feed**: Recent activities across all projects
- **Project Feed**: Activities within a specific project
- **Task Feed**: Activities for a specific task
- **User Feed**: Activities performed by a user

### 7. Notifications System

#### Notification Types

| Type | Trigger | Recipient |
|------|---------|-----------|
| TASK_ASSIGNED | Task assigned to user | Assignee |
| TASK_UPDATED | Task modified by someone else | Assignee |
| COMMENT_ADDED | Comment on assigned task | Assignee |
| PROJECT_INVITE | Added to project | New member |
| TASK_DUE_SOON | Task due in 24 hours | Assignee (future) |
| TASK_OVERDUE | Task past due date | Assignee (future) |

#### Notification Features
- **In-App Notifications**: Bell icon with badge count
- **Real-Time Delivery**: Via WebSocket
- **Mark as Read**: Individual or bulk
- **Click Navigation**: Navigate to related task/project
- **Unread Count**: Visible badge on notification bell

---

## 🗄️ Database Design

### Entity-Relationship Diagram

```
┌─────────────┐
│    USER     │
├─────────────┤
│ id (PK)     │──┐
│ username    │  │
│ email       │  │
│ password    │  │
│ fullName    │  │
│ role        │  │
│ createdAt   │  │
│ updatedAt   │  │
└─────────────┘  │
       │         │
       │ 1       │
       │         │
       │ *       │
┌─────────────┐  │
│   PROJECT   │  │
├─────────────┤  │
│ id (PK)     │  │
│ name        │  │
│ description │  │
│ owner_id(FK)│──┘
│ createdAt   │
│ updatedAt   │
└─────────────┘
       │
       │ *
       │
┌──────────────────┐
│ PROJECT_MEMBERS  │ (Join Table)
├──────────────────┤
│ project_id (FK)  │
│ user_id (FK)     │
└──────────────────┘
       │
       │
┌─────────────┐
│    TASK     │
├─────────────┤
│ id (PK)     │
│ title       │
│ description │
│ status      │
│ priority    │
│ dueDate     │
│ project_id  │──→ PROJECT
│ created_by  │──→ USER
│ assigned_to │──→ USER
│ createdAt   │
│ updatedAt   │
└─────────────┘
       │
       │ 1
       │
       │ *
┌─────────────┐
│   COMMENT   │
├─────────────┤
│ id (PK)     │
│ content     │
│ task_id(FK) │──→ TASK
│ user_id(FK) │──→ USER
│ createdAt   │
│ updatedAt   │
└─────────────┘

┌────────────────┐
│   ACTIVITY     │
├────────────────┤
│ id (PK)        │
│ type           │
│ description    │
│ user_id (FK)   │──→ USER
│ task_id (FK)   │──→ TASK
│ project_id(FK) │──→ PROJECT
│ createdAt      │
└────────────────┘

┌────────────────┐
│ NOTIFICATION   │
├────────────────┤
│ id (PK)        │
│ title          │
│ message        │
│ type           │
│ user_id (FK)   │──→ USER
│ task_id (FK)   │──→ TASK
│ project_id(FK) │──→ PROJECT
│ isRead         │
│ createdAt      │
└────────────────┘
```

### Database Tables

#### users
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### projects
```sql
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### project_members (Join Table)
```sql
CREATE TABLE project_members (
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### tasks
```sql
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    project_id BIGINT,
    created_by_id BIGINT NOT NULL,
    assigned_to_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### comments
```sql
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(2000) NOT NULL,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### activities
```sql
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    user_id BIGINT NOT NULL,
    task_id BIGINT,
    project_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### notifications
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    task_id BIGINT,
    project_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

### Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Task queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Comment queries
CREATE INDEX idx_comments_task ON comments(task_id);

-- Activity queries
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_task ON activities(task_id);
CREATE INDEX idx_activities_project ON activities(project_id);

-- Notification queries
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

---

## 🔧 Backend Implementation

### Package Structure

```
src/main/java/com/taskmanagement/
├── config/
│   ├── SecurityConfig.java          # Spring Security configuration
│   ├── JwtAuthenticationFilter.java # JWT token validation
│   └── WebSocketConfig.java         # WebSocket STOMP configuration
├── controller/
│   ├── AuthController.java          # Authentication endpoints
│   ├── TaskController.java          # Task CRUD endpoints
│   ├── ProjectController.java       # Project CRUD endpoints
│   ├── CommentController.java       # Comment endpoints
│   ├── ActivityController.java      # Activity feed endpoints
│   ├── NotificationController.java  # Notification endpoints
│   ├── UserController.java          # User management
│   └── WebSocketController.java     # WebSocket message handling
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── TaskRequest.java
│   │   ├── ProjectRequest.java
│   │   └── CommentRequest.java
│   ├── response/
│   │   ├── AuthResponse.java
│   │   ├── TaskResponse.java
│   │   ├── ProjectResponse.java
│   │   ├── CommentResponse.java
│   │   ├── ActivityResponse.java
│   │   └── NotificationResponse.java
│   └── websocket/
│       ├── TaskUpdateMessage.java
│       └── NotificationMessage.java
├── entity/
│   ├── User.java                    # User entity
│   ├── Task.java                    # Task entity
│   ├── Project.java                 # Project entity
│   ├── Comment.java                 # Comment entity
│   ├── Activity.java                # Activity log entity
│   ├── Notification.java            # Notification entity
│   └── Role.java                    # User role enum
├── exception/
│   ├── GlobalExceptionHandler.java  # Centralized exception handling
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── repository/
│   ├── UserRepository.java
│   ├── TaskRepository.java
│   ├── ProjectRepository.java
│   ├── CommentRepository.java
│   ├── ActivityRepository.java
│   └── NotificationRepository.java
├── service/
│   ├── AuthService.java             # Authentication logic
│   ├── JwtService.java              # JWT token generation/validation
│   ├── TaskService.java             # Task business logic
│   ├── ProjectService.java          # Project business logic
│   ├── CommentService.java          # Comment business logic
│   ├── ActivityService.java         # Activity logging
│   ├── NotificationService.java     # Notification management
│   └── UserService.java             # User management
└── TaskmanagementApiApplication.java # Main application class
```

### Key Backend Components

#### Security Configuration

**SecurityConfig.java** - Core security setup:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/ws/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**Key Features:**
- CSRF disabled (JWT tokens used instead)
- CORS configured for frontend
- Stateless sessions (no server-side sessions)
- JWT filter validates every request
- Public endpoints: `/api/auth/**`, `/ws/**`

#### JWT Authentication

**JwtService.java** - Token management:

```java
@Service
public class JwtService {
    
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
```

**Token Flow:**
1. User logs in with username/password
2. Server validates credentials
3. Server generates JWT token with user info
4. Client stores token in localStorage
5. Client sends token in `Authorization: Bearer {token}` header
6. Server validates token on each request

#### Service Layer Example

**TaskService.java** - Business logic:

```java
@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public TaskResponse createTask(TaskRequest request, User currentUser) {
        // Build task entity
        Task task = Task.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .status(request.getStatus())
            .priority(request.getPriority())
            .createdBy(currentUser)
            .build();
        
        // Save to database
        Task savedTask = taskRepository.save(task);
        
        // Log activity
        activityService.logActivity(
            ActivityType.TASK_CREATED,
            "Task created: " + task.getTitle(),
            currentUser,
            savedTask,
            null
        );
        
        // Send notification if assigned to someone
        if (task.getAssignedTo() != null) {
            notificationService.createNotification(
                task.getAssignedTo(),
                "New Task Assigned",
                "You have a new task: " + task.getTitle(),
                NotificationType.TASK_ASSIGNED,
                task,
                null
            );
        }
        
        // Send WebSocket update
        TaskResponse response = mapToResponse(savedTask);
        messagingTemplate.convertAndSend("/topic/tasks", response);
        
        return response;
    }
}
```

**Service Responsibilities:**
- Business logic validation
- Database operations via repositories
- Activity logging
- Notification creation
- WebSocket message broadcasting
- DTO mapping

#### WebSocket Configuration

**WebSocketConfig.java:**

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }
}
```

**WebSocket Architecture:**
- **Endpoint**: `/ws` - Connection point
- **Broker**: `/topic` (broadcast), `/queue` (point-to-point)
- **App Prefix**: `/app` - Client-to-server messages
- **Protocol**: STOMP over SockJS

---

## ⚛️ Frontend Implementation

### Project Structure

```
src/
├── api/
│   └── axios.js                 # Axios instance with interceptors
├── services/
│   ├── authService.js          # Auth API calls
│   ├── taskService.js          # Task API calls
│   ├── projectService.js       # Project API calls
│   ├── commentService.js       # Comment API calls
│   ├── activityService.js      # Activity API calls
│   ├── notificationService.js  # Notification API calls
│   ├── userService.js          # User API calls
│   └── websocketService.js     # WebSocket management
├── store/
│   ├── store.js                # Redux store configuration
│   └── slices/
│       ├── authSlice.js        # Auth state management
│       ├── taskSlice.js        # Task state management
│       ├── projectSlice.js     # Project state management
│       └── notificationSlice.js # Notification state
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── tasks/
│   │   ├── TaskList.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   └── TaskFilters.jsx
│   ├── projects/
│   │   ├── ProjectList.jsx
│   │   ├── ProjectCard.jsx
│   │   └── ProjectForm.jsx
│   ├── comments/
│   │   ├── CommentList.jsx
│   │   ├── CommentItem.jsx
│   │   └── CommentForm.jsx
│   ├── activities/
│   │   ├── ActivityFeed.jsx
│   │   └── ActivityItem.jsx
│   ├── notifications/
│   │   ├── NotificationBell.jsx
│   │   ├── NotificationPanel.jsx
│   │   └── NotificationItem.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       └── Loader.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProjectsPage.jsx
│   ├── ProjectDetailsPage.jsx
│   ├── TaskDetailsPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── PrivateRoute.jsx
├── hooks/
│   └── useWebSocket.js         # Custom WebSocket hook
├── utils/
│   ├── constants.js            # App constants
│   └── helpers.js              # Helper functions
├── App.jsx
├── main.jsx
└── index.css
```

### Key Frontend Components

#### Redux State Management

**store.js** - Central store:

```javascript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    projects: projectReducer,
    notifications: notificationReducer,
  }
});
```

**authSlice.js** - Auth state:

```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
```

**Benefits:**
- Centralized state
- Predictable state updates
- DevTools integration
- Time-travel debugging

#### API Service Layer

**axios.js** - HTTP client configuration:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Request interceptor - Add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**taskService.js** - Task API calls:

```javascript
class TaskService {
  async getAllTasks() {
    const response = await api.get('/tasks');
    return response.data;
  }

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  }

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  }

  async deleteTask(id) {
    await api.delete(`/tasks/${id}`);
  }
}

export default new TaskService();
```

**Service Pattern Benefits:**
- Centralized API calls
- Reusable across components
- Easy to test
- Clear API contracts

#### WebSocket Integration

**websocketService.js:**

```javascript
class WebSocketService {
  connect(token, onConnect) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log('Connected to WebSocket');
        onConnect();
      }
    });
    this.client.activate();
  }

  subscribe(destination, callback) {
    return this.client.subscribe(destination, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  }
}

export default new WebSocketService();
```

**useWebSocket.js** - Custom hook:

```javascript
export const useWebSocket = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) return;

    websocketService.connect(token, () => {
      // Subscribe to user notifications
      websocketService.subscribe(
        `/topic/user/${user.id}/notifications`,
        (notification) => {
          dispatch(addNotification(notification));
          toast.success(notification.title);
        }
      );

      // Subscribe to task updates
      websocketService.subscribe('/topic/tasks', (message) => {
        dispatch(fetchTasks()); // Refresh task list
      });
    });

    return () => websocketService.disconnect();
  }, [token, user, dispatch]);

  return { isConnected: websocketService.isConnected() };
};
```

---

## 🔄 Real-Time Features

### WebSocket Communication Flow

```
┌──────────────────────────────────────────────────────────────┐
│  SCENARIO: User A creates a task                             │
└──────────────────────────────────────────────────────────────┘

Step 1: User A creates task in UI
    ↓
Step 2: Frontend sends POST /api/tasks
    ↓
Step 3: Backend creates task in database
    ↓
Step 4: Backend logs activity
    ↓
Step 5: Backend sends notification (if assigned)
    ↓
Step 6: Backend broadcasts via WebSocket
    messagingTemplate.convertAndSend("/topic/tasks", taskData)
    ↓
Step 7: All connected clients receive message
    ├─→ User A: Task appears in their list
    ├─→ User B: Task appears in their list (real-time!)
    └─→ User C: Task appears in their list (real-time!)
    ↓
Step 8: If assigned to User B:
    Backend sends to /topic/user/{B.id}/notifications
    ↓
    User B receives notification (bell icon updates)
```

### Subscription Management

**Client Subscriptions:**

```javascript
// User connects to WebSocket
websocketService.connect(token, () => {
  
  // 1. Subscribe to personal notifications
  websocketService.subscribe(
    `/topic/user/${userId}/notifications`,
    handleNotification
  );
  
  // 2. Subscribe to all task updates
  websocketService.subscribe(
    '/topic/tasks',
    handleTaskUpdate
  );
  
  // 3. When viewing a project, subscribe to project tasks
  websocketService.subscribe(
    `/topic/project/${projectId}/tasks`,
    handleProjectTaskUpdate
  );
  
  // 4. When viewing a task, subscribe to comments
  websocketService.subscribe(
    `/topic/task/${taskId}/comments`,
    handleNewComment
  );
});
```

### Message Types

**Task Update Message:**

```json
{
  "type": "CREATED" | "UPDATED" | "DELETED",
  "taskId": 123,
  "projectId": 45,
  "message": "Task created: Fix login bug",
  "data": {
    "id": 123,
    "title": "Fix login bug",
    "status": "TODO",
    "priority": "HIGH"
  }
}
```

**Notification Message:**

```json
{
  "notificationId": 456,
  "userId": 789,
  "title": "New Task Assigned",
  "message": "John assigned you: Fix login bug",
  "type": "TASK_ASSIGNED"
}
```

---

## 🔒 Security Implementation

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  REGISTRATION FLOW                                           │
└─────────────────────────────────────────────────────────────┘

1. User submits registration form
   ↓
2. Frontend validates input
   ↓
3. Frontend sends POST /api/auth/register
   ↓
4. Backend validates (username unique, email valid, etc.)
   ↓
5. Backend encrypts password with BCrypt
   ↓
6. Backend saves user to database
   ↓
7. Backend generates JWT token
   ↓
8. Backend returns AuthResponse with token
   ↓
9. Frontend stores token in localStorage
   ↓
10. Frontend redirects to /dashboard

┌─────────────────────────────────────────────────────────────┐
│  LOGIN FLOW                                                  │
└─────────────────────────────────────────────────────────────┘

1. User submits login form
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend finds user by username
   ↓
4. Backend compares passwords (BCrypt)
   ↓
5. If valid: Generate JWT and return
   If invalid: Throw BadCredentialsException
   ↓
6. Frontend stores token and redirects

┌─────────────────────────────────────────────────────────────┐
│  AUTHENTICATED REQUEST FLOW                                  │
└─────────────────────────────────────────────────────────────┘

1. User tries to access /api/tasks
   ↓
2. Frontend adds token to request header
   Authorization: Bearer {token}
   ↓
3. Backend JwtAuthenticationFilter intercepts
   ↓
4. Filter validates token
   ↓
5. If valid: Set SecurityContext with user
   If invalid: Return 401 Unauthorized
   ↓
6. Request proceeds to controller
```

### Password Security

**BCrypt Hashing:**

```java
// Registration
String rawPassword = "MyPassword123!";
String hashedPassword = passwordEncoder.encode(rawPassword);
// Result: "$2a$10$N9qo8uLO8/pMvlXZ3fWZ0.vVVXQpjE1rTlRLJWz..."

// Login
boolean matches = passwordEncoder.matches(
    "MyPassword123!",  // User input
    hashedPassword      // Stored hash
);
```

**BCrypt Features:**
- **Salt**: Random salt automatically generated
- **Cost Factor**: 10 rounds (configurable)
- **One-way**: Cannot decrypt the hash
- **Slow**: Intentionally slow to prevent brute force

### JWT Token Structure

**Token Format:**
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huIiwiaWF0IjoxNzA2...
│      HEADER      │   │         PAYLOAD            │  │ SIGNATURE │
```

**Decoded Token:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "john",
    "iat": 1706534400,
    "exp": 1706620800,
    "authorities": ["ROLE_USER"]
  },
  "signature": "..."
}
```

### Role-Based Authorization

**Backend - Method Security:**

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long userId) {
    // Only Admins can execute
}

@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public ProjectResponse createProject(ProjectRequest request) {
    // Admins and Managers can execute
}
```

**Frontend - Conditional Rendering:**

```jsx
const { user } = useSelector((state) => state.auth);

// Show create project button only for Admins and Managers
{(user.role === 'ADMIN' || user.role === 'MANAGER') && (
  <Button onClick={createProject}>Create Project</Button>
)}
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register

**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "USER"
}
```

**Validation Rules:**
- `username`: 3-50 characters, unique
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `fullName`: Optional

#### POST /api/auth/login

**Description:** Authenticate and receive JWT token

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "role": "USER"
}
```

### Task Endpoints

#### GET /api/tasks

**Description:** Get all tasks accessible to current user

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Fix login bug",
    "description": "Users can't login with special characters",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-02-15",
    "project": {
      "id": 5,
      "name": "Authentication Module"
    },
    "createdBy": {
      "id": 2,
      "username": "alice",
      "fullName": "Alice Smith"
    },
    "assignedTo": {
      "id": 1,
      "username": "johndoe",
      "fullName": "John Doe"
    },
    "createdAt": "2024-02-01T10:30:00",
    "updatedAt": "2024-02-10T14:20:00"
  }
]
```

#### POST /api/tasks

**Description:** Create a new task

**Request Body:**
```json
{
  "title": "Implement dark mode",
  "description": "Add dark mode toggle to settings",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-03-01",
  "projectId": 5,
  "assignedToId": 3
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "title": "Implement dark mode",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2024-03-01",
  "project": {...},
  "createdBy": {...},
  "assignedTo": {...},
  "createdAt": "2024-02-14T09:15:00",
  "updatedAt": "2024-02-14T09:15:00"
}
```

#### PUT /api/tasks/{id}

**Description:** Update an existing task

**Request Body:** Same as POST

**Response (200 OK):** Updated task object

#### DELETE /api/tasks/{id}

**Description:** Delete a task

**Response (204 No Content)**

### WebSocket Topics

#### Connection Endpoint
```
ws://localhost:8080/ws
```

#### Subscribe to Topics

| Topic | Description | Access |
|-------|-------------|--------|
| `/topic/tasks` | All task updates | All authenticated users |
| `/topic/project/{projectId}/tasks` | Project-specific tasks | Project members |
| `/topic/task/{taskId}/comments` | Task comments | Users with task access |
| `/topic/user/{userId}/notifications` | User notifications | Individual user only |

---

## 📅 Development Phases

### Phase 1: Foundation & Basic CRUD
**Duration:** ~2-3 days

**What We Built:**
- ✅ Backend Spring Boot setup
- ✅ MySQL database integration
- ✅ User authentication (JWT)
- ✅ Basic CRUD for tasks
- ✅ React frontend setup
- ✅ Redux state management
- ✅ Login/Register pages
- ✅ Task list and creation

**Key Achievements:**
- Fully functional authentication
- Basic task management
- Responsive UI with Tailwind

### Phase 2: Role-Based Access & Projects
**Duration:** ~3-4 days

**What We Built:**
- ✅ User roles (Admin, Manager, User)
- ✅ Project management system
- ✅ Team member assignment
- ✅ Enhanced task properties (priority, due date)
- ✅ Task assignment to team members
- ✅ Role-based UI rendering
- ✅ Project detail pages

**Key Achievements:**
- Multi-tenant architecture
- Granular access control
- Team collaboration features

### Phase 3: Real-time Collaboration & Advanced Features
**Duration:** ~4-5 days

**What We Built:**
- ✅ WebSocket integration
- ✅ Real-time task updates
- ✅ Comment system
- ✅ Activity tracking
- ✅ Notification system
- ✅ Activity feed
- ✅ Task detail pages

**Key Achievements:**
- True real-time collaboration
- Complete audit trail
- In-app notifications
- Production-ready features

---

## 🚀 Setup & Installation

### Prerequisites

**Required Software:**
- Java 17 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Git
- IDE (IntelliJ IDEA, VS Code)

**Verify Installation:**
```bash
java -version    # Should show Java 17+
node -version    # Should show v18+
npm -version     # Should show 9+
mysql --version  # Should show 8.0+
```

### Backend Setup

#### Step 1: Clone Repository
```bash
git clone <your-backend-repo-url>
cd taskmanagement-api
```

#### Step 2: Create MySQL Database
```sql
CREATE DATABASE taskmanagement_db;
```

#### Step 3: Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagement_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000
```

**Generate JWT Secret:**
```bash
openssl rand -hex 32
```

#### Step 4: Build and Run
```bash
# Using Maven Wrapper
./mvnw clean install
./mvnw spring-boot:run

# Or using installed Maven
mvn clean install
mvn spring-boot:run
```

**Backend should start on:** `http://localhost:8080`

**Verify Backend:**
```bash
curl http://localhost:8080/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123","fullName":"Test User"}'
```

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd taskmanagement-ui
```

#### Step 2: Install Dependencies
```bash
npm install

# Install WebSocket dependencies
npm install sockjs-client @stomp/stompjs
```

#### Step 3: Configure Environment

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080
```

#### Step 4: Run Development Server
```bash
npm run dev
```

**Frontend should start on:** `http://localhost:5173`

**Verify Frontend:**
1. Open browser: `http://localhost:5173`
2. Register a new account
3. Login
4. Create a task

### Common Setup Issues

**Issue 1: Port Already in Use**
```
Error: Port 8080 already in use
```
**Solution:**
```bash
# Find process on port 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill process or change port in application.properties
server.port=8081
```

**Issue 2: Database Connection Failed**
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
- Verify MySQL is running
- Check username/password in application.properties
- Grant privileges if needed:
```sql
GRANT ALL PRIVILEGES ON taskmanagement_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Issue 3: CORS Errors in Frontend**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify backend CORS configuration includes frontend URL
- Check `SecurityConfig.java` `corsConfigurationSource()`
- Ensure frontend is running on allowed origin

**Issue 4: JWT Token Invalid**
```
401 Unauthorized - Invalid JWT token
```
**Solution:**
- Check JWT secret matches in application.properties
- Verify token hasn't expired (24 hours)
- Clear localStorage and login again

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Logout
- [ ] Token expiration (after 24 hours)

#### Tasks
- [ ] Create task
- [ ] View task list
- [ ] Update task status
- [ ] Update task priority
- [ ] Assign task to user
- [ ] Delete task
- [ ] Filter tasks by status

#### Projects
- [ ] Create project (as Manager/Admin)
- [ ] Add team members
- [ ] Remove team members
- [ ] View project details
- [ ] View project tasks
- [ ] Delete project

#### Real-time Features
- [ ] Open two browser windows
- [ ] Create task in one window
- [ ] Verify it appears in other window
- [ ] Add comment, verify real-time update
- [ ] Check notification delivery

#### Notifications
- [ ] Assign task to another user
- [ ] Verify notification received
- [ ] Click notification to navigate
- [ ] Mark notification as read
- [ ] Mark all as read

#### Comments
- [ ] Add comment to task
- [ ] Verify comment appears
- [ ] Delete own comment
- [ ] Try to delete other's comment (should fail)

---

## 🌐 Deployment Guide

### Deploy to Railway (Recommended)

#### Backend Deployment

1. **Create Railway Account**: Visit [railway.app](https://railway.app)

2. **Create New Project**: Click "New Project" → "Deploy from GitHub repo"

3. **Add MySQL Database**: 
   - Click "New" → "Database" → "Add MySQL"
   - Copy connection details

4. **Configure Environment Variables**:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[host]:[port]/railway
   SPRING_DATASOURCE_USERNAME=[username]
   SPRING_DATASOURCE_PASSWORD=[password]
   JWT_SECRET=[your-secret-key]
   JWT_EXPIRATION=86400000
   ```

5. **Deploy**: Railway automatically builds and deploys

#### Frontend Deployment

1. **Update API URLs** in `.env.production`:
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_WS_URL=https://your-backend.railway.app
   ```

2. **Build Production Bundle**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel/Netlify**:
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Deploy

---

## 🔮 Future Enhancements

### Short-term Enhancements
- **File Attachments**: Upload files to tasks
- **Advanced Search**: Full-text search across tasks
- **Email Notifications**: Send email on task assignment
- **Task Templates**: Create reusable task templates
- **Labels/Tags**: Add custom labels to tasks

### Medium-term Enhancements
- **Time Tracking**: Log time spent on tasks
- **Task Dependencies**: Block tasks based on dependencies
- **Recurring Tasks**: Daily/weekly/monthly tasks
- **Mobile Apps**: Native iOS and Android apps
- **Integrations**: Slack, Email, Calendar sync

### Long-term Enhancements
- **Advanced Analytics**: Team productivity metrics
- **AI Features**: Smart task suggestions
- **Kanban Boards**: Drag-and-drop interface
- **Version Control**: Task history and rollback
- **Multi-language Support**: Internationalization (i18n)

---

## 📊 Project Statistics

- **Total Lines of Code**: ~15,000+
- **Development Time**: ~10-12 days
- **Features Implemented**: 30+
- **Database Tables**: 7
- **API Endpoints**: 25+
- **React Components**: 40+
- **WebSocket Channels**: 4

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Spring Boot Team for the amazing framework
- React Team for the powerful UI library
- All open-source contributors

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**Built with ❤️ using Spring Boot and React**
