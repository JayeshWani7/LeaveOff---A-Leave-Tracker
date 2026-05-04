const Attendance = require("../models/Attendance");
const {
  checkIn,
  checkOut,
  getDailyStatus,
  normalizeDate,
} = require("../utils/attendance");

function resolveUserId(req) {
  return (req.user && req.user.id) || req.body.userId || req.query.userId;
}

function isAdminRole(role) {
  return role === "manager" || role === "superadmin";
}

async function handleCheckIn(req, res) {
  try {
    const userId = resolveUserId(req);
    if (req.user && req.body.userId && !isAdminRole(req.user.role) && req.body.userId !== req.user.id) {
      return res.status(403).json({ message: "Cannot check in for another user." });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const attendance = await checkIn(userId, new Date(), req.body.notes);
    return res.status(201).json(attendance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function handleCheckOut(req, res) {
  try {
    const userId = resolveUserId(req);
    if (req.user && req.body.userId && !isAdminRole(req.user.role) && req.body.userId !== req.user.id) {
      return res.status(403).json({ message: "Cannot check out for another user." });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const attendance = await checkOut(userId, new Date());
    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getTodayAttendance(req, res) {
  try {
    const userId = resolveUserId(req);
    if (req.user && req.query.userId && !isAdminRole(req.user.role) && req.query.userId !== req.user.id) {
      return res.status(403).json({ message: "Cannot access another user's attendance." });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const today = normalizeDate(new Date());
    const attendance = await Attendance.findOne({ userId, date: today }).lean();
    const status = await getDailyStatus(userId, today);

    // Return a flat shape so the frontend can read checkIn, checkOut, status directly
    return res.status(200).json({
      date: today,
      status,
      checkIn: attendance ? attendance.checkInTime : null,
      checkOut: attendance ? attendance.checkOutTime : null,
      totalHours: attendance ? attendance.totalHours : null,
      notes: attendance ? attendance.notes : null,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getUserAttendance(req, res) {
  try {
    const userId = req.params.id;
    if (req.user && req.user.id !== userId && !isAdminRole(req.user.role)) {
      return res.status(403).json({ message: "Cannot access another user's attendance." });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const records = await Attendance.find({ userId })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json(records);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

/**
 * GET /api/attendance/history
 * Returns the last 30 attendance records for the authenticated user.
 */
async function getMyAttendanceHistory(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const records = await Attendance.find({ userId })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    // Normalise field names to match what the frontend expects
    const shaped = records.map((r) => ({
      _id: r._id,
      date: r.date,
      status: r.status,
      checkIn: r.checkInTime,
      checkOut: r.checkOutTime,
      totalHours: r.totalHours,
      notes: r.notes,
    }));

    return res.status(200).json(shaped);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  handleCheckIn,
  handleCheckOut,
  getTodayAttendance,
  getUserAttendance,
  getMyAttendanceHistory,
};
