# Architecture

## Overview
LeaveOff is a leave-tracking system with role-based access. It includes fake authentication for demo/testing, separate dashboards for employees and managers, a leave request workflow, a calendar view, an API layer, and a persistent database schema.

## Features
- Auth (fake login / role-based)
- Employee Dashboard
- Manager Dashboard
- Leave Form
- Calendar View
- API Layer
- DB Schema
- Audit Logs

## System Components
### Auth (Fake Login / Role-Based)
- Mock authentication provider with predefined users.
- Roles: Employee, Manager.
- Session token stored client-side.

### Employee Dashboard
- View leave balance, upcoming leaves, and request history.
- Quick actions: new leave request, cancel request.

### Manager Dashboard
- Team leave overview.
- Pending approvals queue.
- Approve/deny with comments.

### Leave Form
- Fields: leave type, start date, end date, reason, half-day option.
- Client-side validation and server-side validation.

### Calendar View
- Monthly view of team leaves.
- Filters by employee, leave type, and status.

### API Layer
- REST endpoints for auth, leave requests, approvals, and calendar data.
- Role-based authorization at endpoint level.

### DB Schema
- Users, LeaveTypes, LeaveRequests, AuditLogs.

## API Endpoints (Draft)
- POST /auth/login
- GET /me
- GET /leaves
- POST /leaves
- PUT /leaves/{id}/cancel
- GET /approvals
- PUT /approvals/{id}
- GET /calendar

## Database Schema (Draft)
### Users
- id (PK)
- name
- email
- role (Employee, Manager)
- manager_id (FK -> Users)
- created_at

### LeaveTypes
- id (PK)
- name (Sick, Vacation, etc.)
- yearly_quota

### LeaveRequests
- id (PK)
- user_id (FK -> Users)
- leave_type_id (FK -> LeaveTypes)
- start_date
- end_date
- working_days
- reason
- status (Pending, Approved, Rejected)
- applied_to (FK -> Users)
- manager_comment
- approved_by (FK -> Users)
- approved_at
- created_at

### AuditLogs
- id (PK)
- leave_request_id (FK -> LeaveRequests)
- action (CREATED, APPROVED, REJECTED)
- performed_by (FK -> Users)
- comment
- timestamp
