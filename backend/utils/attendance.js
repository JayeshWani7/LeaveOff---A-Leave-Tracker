const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");

function normalizeDate(input) {
  const date = new Date(input);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getDayBounds(input) {
  const start = normalizeDate(input);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
}

function calculateTotalHours(checkInTime, checkOutTime) {
  if (!checkInTime || !checkOutTime) {
    return null;
  }

  const diffMs = checkOutTime.getTime() - checkInTime.getTime();
  if (diffMs < 0) {
    return null;
  }

  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
}

async function hasApprovedLeave(userId, date) {
  const { start, end } = getDayBounds(date);
  return LeaveRequest.exists({
    userId,
    status: "Approved",
    startDate: { $lte: end },
    endDate: { $gte: start },
  });
}

async function getDailyStatus(userId, date) {
  if (await hasApprovedLeave(userId, date)) {
    return "On-Leave";
  }

  const day = normalizeDate(date);
  const attendance = await Attendance.findOne({ userId, date: day }).lean();

  if (!attendance) {
    return "Absent";
  }

  if (attendance.checkOutTime && typeof attendance.totalHours === "number") {
    return attendance.totalHours < 4 ? "Half-Day" : "Present";
  }

  if (attendance.checkInTime) {
    return "Present";
  }

  return attendance.status || "Absent";
}

async function checkIn(userId, date = new Date(), notes) {
  const day = normalizeDate(date);
  const existing = await Attendance.findOne({ userId, date: day });

  if (existing && existing.checkInTime) {
    throw new Error("Already checked in for this day.");
  }

  const status = (await hasApprovedLeave(userId, day)) ? "On-Leave" : "Present";

  if (existing) {
    existing.checkInTime = new Date();
    existing.status = status;
    if (notes) {
      existing.notes = notes;
    }
    return existing.save();
  }

  const attendance = new Attendance({
    userId,
    date: day,
    checkInTime: new Date(),
    status,
    notes,
  });

  return attendance.save();
}

async function checkOut(userId, date = new Date()) {
  const day = normalizeDate(date);
  const attendance = await Attendance.findOne({ userId, date: day });

  if (!attendance || !attendance.checkInTime) {
    throw new Error("No check-in found for this day.");
  }

  if (attendance.checkOutTime) {
    throw new Error("Already checked out for this day.");
  }

  attendance.checkOutTime = new Date();

  if (await hasApprovedLeave(userId, day)) {
    attendance.status = "On-Leave";
  }

  return attendance.save();
}

module.exports = {
  calculateTotalHours,
  checkIn,
  checkOut,
  getDailyStatus,
  normalizeDate,
};
