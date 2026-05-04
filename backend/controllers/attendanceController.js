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

async function handleCheckIn(req, res) {
  try {
    const userId = resolveUserId(req);
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
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const today = normalizeDate(new Date());
    const attendance = await Attendance.findOne({ userId, date: today }).lean();
    const status = await getDailyStatus(userId, today);

    return res.status(200).json({
      date: today,
      status,
      attendance,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getUserAttendance(req, res) {
  try {
    const userId = req.params.id;
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

module.exports = {
  handleCheckIn,
  handleCheckOut,
  getTodayAttendance,
  getUserAttendance,
};
