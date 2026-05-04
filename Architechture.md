# 🏗️ Architecture — Leave & Time-Off Tracker

---

## 📌 Overview

**LeaveOff** is a full-stack internal HR system designed to manage:

* Leave requests
* Attendance (daily check-in/out)
* Manager approvals
* Team availability (calendar)

The system is built with a **clear separation of concerns**, ensuring scalability, maintainability, and real-world usability.

---

## 🎯 Key Design Goals

* Keep the system **simple but production-oriented**
* Ensure **data integrity via server-side validation**
* Maintain **clear separation between modules** (Leave vs Attendance)
* Support **role-based workflows** (Employee vs Manager)
* Enable **easy extensibility** (notifications, analytics, etc.)

---

## 🧠 Architecture Decisions (Important)

### 1. Why MongoDB (NoSQL)?

* Flexible schema for evolving requirements
* Easy relationship handling via ObjectId references
* Faster development for time-constrained environment

> Trade-off: Relational DB could enforce stricter joins, but MongoDB offers speed and flexibility here.

---

### 2. Separation of Modules

| Module            | Responsibility          |
| ----------------- | ----------------------- |
| Leave System      | Planned absences        |
| Attendance System | Daily presence tracking |

👉 This prevents mixing business logic and makes scaling easier.

---

### 3. Dynamic Leave Balance (No Storage)

Leave balance is **NOT stored** in DB.

Instead:

```
balance = yearlyQuota - sum(approved leave days)
```

> Reason: Avoids inconsistency and redundant data.

---

### 4. JWT-based Authentication

* Stateless authentication
* Token contains `userId` and `role`
* Middleware protects routes

> Keeps system simple and scalable without session storage.

---

### 5. Audit Logging

Every critical action:

* Create leave
* Approve / Reject

👉 Logged in `AuditLogs`

> Helps debugging, traceability, and real-world compliance.

---

## 🧩 System Components

### 🔐 Authentication & Authorization

* JWT-based login
* Middleware:

  * `authMiddleware` → verifies token
  * `roleMiddleware` → restricts access
* Roles:

  * Employee
  * Manager

---

### 👤 Employee Dashboard

* Leave balance (calculated dynamically)
* Leave history (filterable)
* Pending requests
* Attendance summary

---

### 👨‍💼 Manager Dashboard

* Pending leave approvals
* Approve / Reject with comments
* Action history

---

### 📝 Leave System

* Create leave request
* Validation:

  * Dates
  * Leave balance
* Workflow:

  ```
  Pending → Approved / Rejected
  ```

---

### 🕒 Attendance System

* Daily check-in / check-out
* Auto-calculates:

  * Total hours
  * Status:

    * Present
    * Half-Day
    * Absent
    * On-Leave

> Attendance status is overridden if approved leave exists.

---

### 📅 Calendar View

* Weekly leave visibility
* Shows team availability
* Helps avoid scheduling conflicts

---

## 🌐 API Layer

### Auth

* `POST /auth/login`
* `GET /me`

---

### Leave

* `POST /leaves`
* `GET /leaves`
* `PUT /leaves/:id/approve`
* `PUT /leaves/:id/reject`

---

### Attendance

* `POST /attendance/check-in`
* `POST /attendance/check-out`
* `GET /attendance/today`
* `GET /attendance/user/:id`

---

### Dashboard

* `GET /dashboard`
* `GET /calendar`

---

## 🗄️ Database Schema (MongoDB / Mongoose)

---

### 👤 Users Collection

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  role: "employee" | "manager",
  managerId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

* `email` (unique)

---

### 🏷️ LeaveTypes Collection

```js
{
  _id: ObjectId,
  name: String, // Sick, Casual, WFH, Comp-off
  yearlyQuota: Number,
  createdAt: Date
}
```

---

### 📄 LeaveRequests Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,
  leaveType: ObjectId,
  startDate: Date,
  endDate: Date,
  workingDays: Number,
  reason: String,
  status: "Pending" | "Approved" | "Rejected",
  appliedTo: ObjectId,
  managerComment: String,
  approvedBy: ObjectId,
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

* `userId`
* `status`
* `startDate`

---

### 📜 AuditLogs Collection

```js
{
  _id: ObjectId,
  leaveRequestId: ObjectId,
  action: "CREATED" | "APPROVED" | "REJECTED",
  performedBy: ObjectId,
  comment: String,
  timestamp: Date
}
```

---

### 🕒 Attendance Collection

```js
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  totalHours: Number,
  status: "Present" | "Half-Day" | "Absent" | "On-Leave",
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

* `{ userId: 1, date: 1 }` (unique)
* `date`

---

## 🔗 Relationships

* User → LeaveRequests (1:N)
* User → Attendance (1:N)
* Manager → Employees (1:N)
* LeaveType → LeaveRequests (1:N)
* LeaveRequest → AuditLogs (1:N)

---

## ⚙️ Business Logic Highlights

### Working Days Calculation

* Excludes weekends
* Can be extended to exclude holidays

---

### Attendance Rules

* One record per user per day
* `< 4 hours` → Half-Day
* Approved leave → overrides attendance

---

### Validation Strategy

* All critical validation is **server-side**
* Client-side validation only for UX

---

## ⚡ Trade-offs & Constraints

| Decision             | Reason             |
| -------------------- | ------------------ |
| No refresh tokens    | Keep auth simple   |
| No real-time updates | Time constraint    |
| No holiday calendar  | Out of scope       |
| MongoDB over SQL     | Faster development |

---

## 🚀 Future Improvements

* Real-time updates (WebSockets)
* Email / push notifications
* Holiday calendar integration
* CSV export reports
* Analytics dashboard
* Role hierarchy (HR/Admin)

---

## 🧠 What I’d Improve With More Time

* Add caching for dashboard queries
* Normalize audit logging structure
* Improve calendar UI (drag-drop)
* Introduce service layer abstraction

---

## ✅ Summary

This system is designed to:

* Be **simple enough to build quickly**
* Be **structured enough to scale**
* Reflect **real-world engineering practices**

---
