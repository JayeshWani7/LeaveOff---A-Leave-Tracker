const express = require("express");

const {
  handleCheckIn,
  handleCheckOut,
  getTodayAttendance,
  getUserAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/attendance/check-in", handleCheckIn);
router.post("/attendance/check-out", handleCheckOut);
router.get("/attendance/today", getTodayAttendance);
router.get("/attendance/user/:id", getUserAttendance);

module.exports = router;
