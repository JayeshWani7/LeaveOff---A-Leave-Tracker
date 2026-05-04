const express = require("express");

const {
	createLeaveRequest,
	approveLeaveRequest,
	rejectLeaveRequest,
	getTeamLeaveCalendar,
	getPendingLeaveRequests,
	getMyLeaveRequests,
} = require("../controllers/leaveRequestsController");

const router = express.Router();

router.post("/leave-requests", createLeaveRequest);
router.get("/leave-requests/mine", getMyLeaveRequests);
router.get("/leave-requests/pending", getPendingLeaveRequests);
// Original calendar route
router.get("/leave-requests/calendar", getTeamLeaveCalendar);
// Alias used by the frontend
router.get("/leave-requests/team-calendar", getTeamLeaveCalendar);
router.patch("/leave-requests/:id/approve", approveLeaveRequest);
router.patch("/leave-requests/:id/reject", rejectLeaveRequest);

module.exports = router;

