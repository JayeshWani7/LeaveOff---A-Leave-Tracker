## May 4, 2026
- Create a complete backend database schema and models for a Leave & Time-Off Tracker system using Node.js (Express) and MongoDB with Mongoose, including seed data and architecture updates.
- Add required packages, install dependencies, and check seed script requirements.
- Fix seed-time errors (duplicate index warning, pre-validate hook next error) and ensure dependencies are set.
- Update the Leave & Time-Off Tracker backend schema to include Attendance tracking with Mongoose, business logic utilities, and seed data for the last 30 days.
- Create Express APIs for approving and rejecting leave requests with manager-only enforcement, status updates, and audit logging.
- Create an API to fetch team leave calendar for current and next week with filtering and sorting.
- Create Express APIs for the attendance system (check-in, check-out, today, user history).
- Create a backend server.js with Express and route wiring if missing.
- Add RBAC with authentication: username/password login for employee, manager, and superadmin.
- Add login page in frontend with role-based UI visibility and seed specific users after clearing data.
- Fix seed script top-level await error after custom user seeding.
- Wire frontend to backend, relax login role requirement, and connect Apply Leave/Manager actions to APIs.
- Add employee leave request list, seed leave types, date constraints, and manager rejection remarks.
- Troubleshoot proxy connection errors when backend is down.
- Add API base URL configuration to fix frontend requests hitting localhost:3000.
- Fix approval flow crash when request body is missing by guarding managerComment access.
- Add frontend UX improvements: spinners, friendly errors, empty states, and status badges.
- Add global UX improvements: reusable ErrorBanner and SuccessBanner components with dismiss and slide-up animation; upgraded StatusBadge with dot indicator and red variant for Rejected; enhanced Spinner with overlay mode and ARIA roles; enhanced EmptyState with icon slot and fade-in animation; upgraded Badge with red/rose/sky/violet variants; wired Dashboard, Attendance, and Calendar pages to live APIs with loading/error/empty states; Login and ApplyLeave submit buttons now show inline spinners; added slideUp and pulseSoft Tailwind animations; Card base class updated with relative positioning for overlay support.
- Fix 404 API errors: added backend alias routes for /attendance/checkin, /attendance/checkout, /attendance/history (with field-normalised response), and /leave-requests/team-calendar; created /api/dashboard/summary endpoint (dashboardController + dashboard route) returning leaveBalance, pendingCount, onLeaveToday, halfDayCount, attendanceRate; fixed Calendar frontend field mapping to read backend's userName/leaveType string fields.


