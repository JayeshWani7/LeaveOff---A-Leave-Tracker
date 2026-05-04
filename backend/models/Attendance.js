const mongoose = require("mongoose");

const { Schema } = mongoose;

const STATUS = ["Present", "Absent", "Half-Day", "On-Leave"];

function normalizeDate(input) {
  const date = new Date(input);
  date.setUTCHours(0, 0, 0, 0);
  return date;
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

const attendanceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "Present",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });

attendanceSchema.pre("validate", function validateAttendance() {
  if (this.date) {
    this.date = normalizeDate(this.date);
  }

  if (this.checkInTime && this.checkOutTime && this.checkOutTime < this.checkInTime) {
    this.invalidate("checkOutTime", "checkOutTime must be after checkInTime.");
    return;
  }

  if (this.status === "On-Leave") {
    return;
  }

  if (this.checkInTime && this.checkOutTime) {
    this.totalHours = calculateTotalHours(this.checkInTime, this.checkOutTime);
    if (typeof this.totalHours === "number") {
      this.status = this.totalHours < 4 ? "Half-Day" : "Present";
    }
  } else if (this.checkInTime) {
    this.status = "Present";
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
