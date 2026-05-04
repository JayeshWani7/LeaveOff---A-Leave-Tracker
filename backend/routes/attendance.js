const express = require("express");

const {
  handleCheckIn,
  handleCheckOut,
  getTodayAttendance,
  getUserAttendance,
  getMyAttendanceHistory,
} = require("../controllers/attendanceController");

const router = express.Router();

// Original routes (kept for backwards compatibility)
router.post("/attendance/check-in", handleCheckIn);
router.post("/attendance/check-out", handleCheckOut);
router.get("/attendance/today", getTodayAttendance);
router.get("/attendance/user/:id", getUserAttendance);

// Frontend-facing aliases (no hyphens, /history for the logged-in user)
router.post("/attendance/checkin", handleCheckIn);
router.post("/attendance/checkout", handleCheckOut);
router.get("/attendance/history", getMyAttendanceHistory);

module.exports = router;

