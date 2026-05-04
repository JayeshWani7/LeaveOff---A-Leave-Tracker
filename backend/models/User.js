const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["employee", "manager", "superadmin"],
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function requiredManager() {
        return this.role === "employee";
      },
      validate: {
        validator: function validateManagerId(value) {
          if (this.role === "employee") {
            return Boolean(value);
          }
          return !value;
        },
        message: "Employees must have managerId; managers/superadmins must not.",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, managerId: 1 });

module.exports = mongoose.model("User", userSchema);
