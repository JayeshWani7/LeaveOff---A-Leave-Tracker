const mongoose = require("mongoose");

const { Schema } = mongoose;

const leaveTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Sick", "Casual", "WFH", "Comp-off"],
      trim: true,
      unique: true,
    },
    yearlyQuota: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
