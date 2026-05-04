const mongoose = require("mongoose");

const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    leaveRequestId: {
      type: Schema.Types.ObjectId,
      ref: "LeaveRequest",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["CREATED", "APPROVED", "REJECTED"],
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ leaveRequestId: 1, timestamp: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
