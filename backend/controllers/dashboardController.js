const mongoose = require("mongoose");
const { LeaveRequest, LeaveType } = require("../models");
const Attendance = require("../models/Attendance");
const { normalizeDate } = require("../utils/attendance");

/**
 * GET /api/dashboard/summary
 *
 * Returns aggregated stats for the logged-in user's dashboard:
 *   - leaveBalance: remaining days for all leave types combined
 *   - pendingCount: number of the user's own pending requests
 *   - onLeaveToday: count of team members on leave today
 *   - halfDayCount: count of half-day check-ins in the last 7 days
 *   - attendanceRate: percentage of working days present (last 30 calendar days)
 */
async function getDashboardSummary(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const userId = user.id;
    const today = normalizeDate(new Date());

    // --- Leave balance: total quota minus approved working days ---
    const leaveTypes = await LeaveType.find({}).lean();
    const totalQuota = leaveTypes.reduce((sum, lt) => sum + (lt.yearlyQuota || 0), 0);

    const approvedAgg = await LeaveRequest.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "Approved",
        },
      },
      { $group: { _id: null, total: { $sum: "$workingDays" } } },
    ]);
    const usedDays = approvedAgg.length ? approvedAgg[0].total : 0;
    const leaveBalance = Math.max(0, totalQuota - usedDays);

    // --- Pending count: the user's own pending requests ---
    const pendingCount = await LeaveRequest.countDocuments({
      userId,
      status: "Pending",
    });

    // --- On leave today: approved requests covering today ---
    const onLeaveToday = await LeaveRequest.countDocuments({
      status: "Approved",
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    // --- Half-day count: last 7 days ---
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 7);
    const halfDayCount = await Attendance.countDocuments({
      userId,
      date: { $gte: sevenDaysAgo },
      status: "Half-Day",
    });

    // --- Attendance rate: last 30 calendar days ---
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setUTCDate(today.getUTCDate() - 30);

    // Count working days (Mon–Fri) in the last 30 days
    let workingDayCount = 0;
    for (let d = new Date(thirtyDaysAgo); d < today; d.setUTCDate(d.getUTCDate() + 1)) {
      const day = d.getUTCDay();
      if (day !== 0 && day !== 6) workingDayCount += 1;
    }

    const presentCount = await Attendance.countDocuments({
      userId,
      date: { $gte: thirtyDaysAgo, $lt: today },
      status: { $in: ["Present", "Half-Day"] },
    });

    const attendanceRate =
      workingDayCount > 0
        ? Math.round((presentCount / workingDayCount) * 100)
        : 100;

    return res.status(200).json({
      leaveBalance,
      pendingCount,
      onLeaveToday,
      halfDayCount,
      attendanceRate,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getDashboardSummary };
