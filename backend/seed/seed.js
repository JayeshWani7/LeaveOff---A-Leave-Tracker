const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

const { User, LeaveType, LeaveRequest, AuditLog, Attendance } = require("../models");

const MONGODB_URI = process.env.MONGODB_URI;

const LEAVE_TYPES = [
  { name: "Sick", yearlyQuota: 10 },
  { name: "Casual", yearlyQuota: 12 },
  { name: "WFH", yearlyQuota: 20 },
  { name: "Comp-off", yearlyQuota: 5 },
];

async function seedUsers() {
  const passwordHash1 = await bcrypt.hash("908767", 10);
  const passwordHash2 = await bcrypt.hash("908765", 10);
  const passwordHash3 = await bcrypt.hash("9765675", 10);
  const passwordHash4 = await bcrypt.hash("975272", 10);

  const manager = await User.create({
    name: "jayesh3",
    email: "jayesh3@leaveoff.dev",
    username: "jayesh3",
    passwordHash: passwordHash3,
    role: "manager",
  });

  const employees = await User.insertMany([
    {
      name: "jayesh1",
      email: "jayesh1@leaveoff.dev",
      username: "jayesh1",
      passwordHash: passwordHash1,
      role: "employee",
      managerId: manager._id,
    },
    {
      name: "jayesh2",
      email: "jayesh2@leaveoff.dev",
      username: "jayesh2",
      passwordHash: passwordHash2,
      role: "employee",
      managerId: manager._id,
    },
  ]);

  const superadmin = await User.create({
    name: "jayesh4",
    email: "jayesh4@leaveoff.dev",
    username: "jayesh4",
    passwordHash: passwordHash4,
    role: "superadmin",
  });

  return { manager, employees, superadmin };
}

async function seed() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required to run the seed script.");
  }

  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    User.deleteMany({}),
    LeaveType.deleteMany({}),
    LeaveRequest.deleteMany({}),
    AuditLog.deleteMany({}),
    Attendance.deleteMany({}),
  ]);

  const users = await seedUsers();
  await LeaveType.insertMany(LEAVE_TYPES);

  await mongoose.disconnect();

  return { users };
}

seed()
  .then((result) => {
    const employeeCount = result.users.employees.length;
    console.log(
      `Seeded 1 manager, ${employeeCount} employees, 1 superadmin. All other data cleared.`
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
