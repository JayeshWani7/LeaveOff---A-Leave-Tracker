const express = require("express");

const {
	createLeaveRequest,
	approveLeaveRequest,
	rejectLeaveRequest,
	getTeamLeaveCalendar,
} = require("../controllers/leaveRequestsController");

const router = express.Router();

router.post("/leave-requests", createLeaveRequest);
router.get("/leave-requests/calendar", getTeamLeaveCalendar);
router.patch("/leave-requests/:id/approve", approveLeaveRequest);
router.patch("/leave-requests/:id/reject", rejectLeaveRequest);

module.exports = router;
