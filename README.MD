# 🏢 Leave & Time-Off Tracker (Full Stack + Attendance)

A full-stack internal HR tool built for managing **leave requests, attendance, and team availability**. Designed for small teams to replace manual tracking (e.g., WhatsApp, spreadsheets) with a clean, structured system.

---

## 🚀 Features

### 🧑‍💼 Employee Features

* Apply for leave (Sick, Casual, WFH, Comp-off)
* View leave balance (auto-calculated)
* Track leave history with filters (status, date range)
* Daily attendance:

  * Check-in / Check-out
  * View total hours worked
  * Last 7 days attendance summary

---

### 🧑‍💼 Manager Features

* View pending leave requests
* Approve / Reject with comments
* See audit trail (who approved/rejected + timestamp)

---

### 📅 Team Features

* Team calendar (weekly view)
* See who is on leave (current + next week)
* Filter by leave type

---

### 🔐 Authentication & Authorization

* JWT-based login system
* Role-based access:

  * Employees → apply/view leaves
  * Managers → approve/reject
* Protected routes using middleware

---

### 📊 System Features

* Server-side validation (never trust client)
* Leave balance calculation (dynamic)
* Attendance status logic:

  * Present / Half-Day / Absent / On-Leave
* Audit logging for all actions
* Clean REST APIs (Postman/cURL compatible)

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* Tailwind CSS
* shadcn/ui
* Axios

**Backend:**

* Node.js
* Express.js
* MongoDB + Mongoose

**Auth:**

* JWT (jsonwebtoken)
* bcrypt

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── seed/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│
├── ARCHITECTURE.md
├── PROMPTS.md
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites

* Node.js (v16+ recommended)
* MongoDB (local or Atlas)
* npm or yarn

---

## 🔙 Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Backend

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## 🌱 Seed Database

```bash
node seed/seed.js
```

This will generate:

* 3 managers
* 20 employees
* Leave types with quotas
* 25–30 leave requests
* Attendance records (last 30 days)

---

## ⚛️ Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. Login using seeded user credentials
2. Receive JWT token
3. Token stored in localStorage
4. Axios attaches token to API requests
5. Protected routes enforced via middleware

---

## 📡 API Endpoints (Sample)

### Auth

```
POST /auth/login
```

### Leave

```
POST /leaves
GET /leaves
PUT /leaves/:id/approve
PUT /leaves/:id/reject
```

### Attendance

```
POST /attendance/check-in
POST /attendance/check-out
GET /attendance/today
GET /attendance/user/:id
```

### Dashboard

```
GET /dashboard
GET /calendar
```

---

## 🧠 Key Design Decisions

* **Separated Attendance & Leave modules** for scalability
* **Dynamic leave balance calculation** (no redundant storage)
* **Server-side validation** for all critical operations
* **JWT-based auth** with role-based access control
* **Modular architecture** for maintainability

---

## ⚡ Future Improvements

* Real-time updates (WebSockets)
* Email notifications
* Holiday calendar integration
* CSV export reports
* Charts & analytics dashboard
* Half-day leave support (UI enhancements)

---

## 📌 Notes

* This is an internal tool, so authentication is intentionally minimal
* Focus is on **clean architecture, business logic, and usability**
* Built under time constraints to simulate real-world delivery


---
