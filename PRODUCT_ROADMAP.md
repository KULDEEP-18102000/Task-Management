# 🚀 Task Management System - Product Roadmap

This document tracks all planned enhancements, new features, and technical improvements for the Task Management System.

---

## 🔐 Phase 1: Authentication & Security Enhancements
- [x] **Dual Login Support:** Allow users to log in using either their `username` OR `email`.
- [ ] **Account Lockout:** Implement logic to lock an account after 5 failed login attempts (demonstrates security awareness).
- [ ] **Password Reset Flow:** Implement a secure "Forgot Password" flow with email tokens.

## 🏗️ Phase 2: Core Task Management (The "JPA Expert" Phase)
- [ ] **Task Tags & Labels:** Implement a `Many-to-Many` relationship for custom task tagging (Urgent, Bug, Frontend).
- [ ] **Advanced Filtering:** Build a search API using `Spring Data Specifications` to filter by multiple criteria (status, priority, date range).
- [ ] **Task Dependencies:** Allow tasks to be linked (e.g., Task B cannot start until Task A is done).

## 🧪 Phase 3: Professional Engineering (Interview Prep)
- [ ] **Unit & Integration Testing:** Write comprehensive tests using `JUnit 5` and `Mockito` for all Services.
- [ ] **Global Exception Handling:** Refine `@ControllerAdvice` to handle custom business exceptions with structured JSON responses.
- [ ] **Dockerization:** Create a `docker-compose.yml` for the App, MySQL, and Redis.

## ☁️ Phase 4: Media & Performance
- [ ] **File Attachments:** Integrate S3 (or local storage) for uploading documents/images to tasks.
- [ ] **Redis Caching:** Implement caching for high-traffic data like the "Global Activity Feed."
- [ ] **Email Notifications:** Move from just WebSockets to real Email alerts using `Spring Boot Mail`.

## 🎨 Phase 5: UI/UX Improvements
- [ ] **Kanban Board View:** Implement a drag-and-drop board for task statuses.
- [ ] **Dark Mode:** Add a sleek dark theme to the React frontend.
- [ ] **Rich Text Comments:** Support Markdown or Rich Text in task descriptions and comments.

---

### ✅ Completed
- [x] JWT Authentication System
- [x] Basic Project & Task CRUD
- [x] Real-time Notifications (WebSockets)
- [x] Activity Logging System
- [x] Comprehensive Documentation (README)
