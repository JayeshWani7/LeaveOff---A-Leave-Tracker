const mongoose = require("mongoose");

const { Schema } = mongoose;

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

const leaveRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    leaveType: {
      type: Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    workingDays: {
      type: Number,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    appliedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    managerComment: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function validateApprovedBy(value) {
          if (this.status === "Approved") {
            return Boolean(value);
          }
          return true;
        },
        message: "approvedBy is required when status is Approved.",
      },
    },
    approvedAt: {
      type: Date,
      validate: {
        validator: function validateApprovedAt(value) {
          if (this.status === "Approved") {
            return Boolean(value);
          }
          return true;
        },
        message: "approvedAt is required when status is Approved.",
      },
    },
  },
  {
    timestamps: true,
  }
);

leaveRequestSchema.index({ userId: 1, status: 1, startDate: 1, endDate: 1 });
leaveRequestSchema.index({ appliedTo: 1, status: 1 });

leaveRequestSchema.pre("validate", async function validateLeaveRequest() {
  if (this.startDate && this.endDate) {
    const start = normalizeDate(this.startDate);
    const end = normalizeDate(this.endDate);
    if (start > end) {
      this.invalidate("endDate", "endDate must be on or after startDate.");
    }
    this.workingDays = calculateWorkingDays(start, end);
  }

  if (!this.userId || !this.leaveType) {
    return;
  }

  if (this.status === "Rejected") {
    return;
  }

  const LeaveType = mongoose.model("LeaveType");
  const LeaveRequest = mongoose.model("LeaveRequest");

  const leaveType = await LeaveType.findById(this.leaveType).lean();
  if (!leaveType) {
    this.invalidate("leaveType", "Invalid leave type.");
    return;
  }

  const approvedAggregation = await LeaveRequest.aggregate([
    {
      $match: {
        userId: this.userId,
        leaveType: this.leaveType,
        status: "Approved",
        _id: { $ne: this._id },
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

  const requestedDays = this.workingDays || 0;

  if (approvedDays + requestedDays > leaveType.yearlyQuota) {
    this.invalidate(
      "workingDays",
      "Insufficient leave balance for this leave type."
    );
  }
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
