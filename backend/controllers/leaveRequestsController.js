const mongoose = require("mongoose");

const { LeaveRequest, LeaveType, AuditLog, User } = require("../models");

function normalizeDate(input) {
  const date = new Date(input);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = normalizeDate(startDate);
  const end = normalizeDate(endDate);

  if (start > end) {
    return 0;
  }

  let count = 0;
  for (let current = new Date(start); current <= end; ) {
    const day = current.getUTCDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return count;
}

async function ensureSufficientBalance(userId, leaveTypeId, requestedDays) {
  const leaveType = await LeaveType.findById(leaveTypeId).lean();
  if (!leaveType) {
    return { ok: false, message: "Invalid leave type." };
  }

  const approvedAggregation = await LeaveRequest.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        leaveType: new mongoose.Types.ObjectId(leaveTypeId),
        status: "Approved",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$workingDays" },
      },
    },
  ]);

  const approvedDays = approvedAggregation.length
    ? approvedAggregation[0].total
    : 0;

  if (approvedDays + requestedDays > leaveType.yearlyQuota) {
    return { ok: false, message: "Insufficient leave balance." };
  }

  return { ok: true };
}

async function createLeaveRequest(req, res) {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      appliedTo,
      userId,
    } = req.body || {};

    const requesterId = userId || (req.user && req.user.id);

    if (!requesterId || !leaveType || !startDate || !endDate || !reason || !appliedTo) {
      return res.status(400).json({
        message: "leaveType, startDate, endDate, reason, appliedTo, and userId are required.",
      });
    }

    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);

    if (start > end) {
      return res.status(400).json({ message: "startDate must be on or before endDate." });
    }

    const workingDays = calculateWorkingDays(start, end);
    if (workingDays <= 0) {
      return res.status(400).json({ message: "No working days in selected range." });
    }

    const balance = await ensureSufficientBalance(requesterId, leaveType, workingDays);
    if (!balance.ok) {
      return res.status(400).json({ message: balance.message });
    }

    const leaveRequest = await LeaveRequest.create({
      userId: requesterId,
      leaveType,
      startDate: start,
      endDate: end,
      workingDays,
      reason: reason.trim(),
      status: "Pending",
      appliedTo,
    });

    await AuditLog.create({
      leaveRequestId: leaveRequest._id,
      action: "CREATED",
      performedBy: requesterId,
      comment: "Request created.",
      timestamp: leaveRequest.createdAt,
    });

    return res.status(201).json(leaveRequest);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function resolveManager(req) {
  const managerId = (req.user && req.user.id) || req.body.managerId;
  if (!managerId) {
    return null;
  }

  const manager = await User.findById(managerId).lean();
  if (!manager || manager.role !== "manager") {
    return null;
  }

  return manager;
}

async function updateLeaveRequestStatus(req, res, status, auditAction) {
  try {
    const manager = await resolveManager(req);
    if (!manager) {
      return res.status(403).json({ message: "Only managers can approve or reject leave requests." });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found." });
    }

    if (leaveRequest.status !== "Pending") {
      return res.status(400).json({ message: "Leave request already processed." });
    }

    leaveRequest.status = status;
    leaveRequest.managerComment = (req.body.managerComment || "").trim();
    leaveRequest.approvedBy = manager._id;
    leaveRequest.approvedAt = new Date();

    await leaveRequest.save();

    await AuditLog.create({
      leaveRequestId: leaveRequest._id,
      action: auditAction,
      performedBy: manager._id,
      comment: leaveRequest.managerComment || undefined,
      timestamp: leaveRequest.approvedAt,
    });

    return res.status(200).json(leaveRequest);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

function approveLeaveRequest(req, res) {
  return updateLeaveRequestStatus(req, res, "Approved", "APPROVED");
}

function rejectLeaveRequest(req, res) {
  return updateLeaveRequestStatus(req, res, "Rejected", "REJECTED");
}

module.exports = {
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
};
