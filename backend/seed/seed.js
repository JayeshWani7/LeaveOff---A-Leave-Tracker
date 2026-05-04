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

const FIRST_NAMES = [
  "Alex",
  "Jamie",
  "Jordan",
  "Taylor",
  "Riley",
  "Casey",
  "Morgan",
  "Avery",
  "Quinn",
  "Parker",
  "Drew",
  "Rowan",
  "Hayden",
  "Emerson",
  "Reese",
  "Skyler",
  "Harper",
  "Cameron",
  "Elliot",
  "Reagan",
  "Logan",
  "Blake",
  "Tatum",
  "Carter",
  "Sawyer",
  "Remy",
];

const LAST_NAMES = [
  "Singh",
  "Patel",
  "Khan",
  "Sharma",
  "Iyer",
  "Nair",
  "Gupta",
  "Kapoor",
  "Mehta",
  "Rao",
  "Das",
  "Joshi",
  "Chandra",
  "Verma",
  "Sethi",
  "Bose",
  "Kulkarni",
  "Reddy",
  "Pillai",
  "Malhotra",
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function buildEmail(name, index) {
  return `${name.toLowerCase().replace(/\s+/g, ".")}${index}@leaveoff.dev`;
}

function buildUsername(name, index) {
  return `${name.toLowerCase().replace(/\s+/g, "")}${index}`;
}

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

function randomDateRange(year) {
  const month = Math.floor(Math.random() * 12);
  const startDay = Math.floor(Math.random() * 24) + 1;
  const length = Math.floor(Math.random() * 4) + 1;

  const startDate = new Date(Date.UTC(year, month, startDay));
  const endDate = new Date(Date.UTC(year, month, startDay + length));

  return { startDate, endDate };
}

function buildAttendanceRecords(users, approvedRequests) {
  const records = [];
  const approvedByUser = new Map();

  for (const request of approvedRequests) {
    const key = request.userId.toString();
    if (!approvedByUser.has(key)) {
      approvedByUser.set(key, []);
    }
    approvedByUser.get(key).push({
      startDate: request.startDate,
      endDate: request.endDate,
    });
  }

  const today = normalizeDate(new Date());
  const startDate = new Date(today);
  startDate.setUTCDate(startDate.getUTCDate() - 29);

  const allUsers = [...users.managers, ...users.employees];

  for (const user of allUsers) {
    const ranges = approvedByUser.get(user._id.toString()) || [];

    for (let i = 0; i < 30; i += 1) {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + i);

      const { start, end } = getDayBounds(date);
      const onLeave = ranges.some(
        (range) => range.startDate <= end && range.endDate >= start
      );

      if (onLeave) {
        records.push({
          userId: user._id,
          date,
          status: "On-Leave",
          notes: "Approved leave",
        });
        continue;
      }

      const roll = Math.random();

      if (roll < 0.2) {
        continue;
      }

      const isHalfDay = roll < 0.4;
      const checkInTime = new Date(date);
      const checkInHour = 8 + Math.floor(Math.random() * 3);
      const checkInMinute = Math.floor(Math.random() * 60);
      checkInTime.setUTCHours(checkInHour, checkInMinute, 0, 0);

      const checkOutTime = new Date(checkInTime);
      checkOutTime.setUTCHours(checkInTime.getUTCHours() + (isHalfDay ? 3 : 8));

      records.push({
        userId: user._id,
        date,
        checkInTime,
        checkOutTime,
        notes: isHalfDay ? "Half-day" : "Full day",
      });
    }
  }

  return records;
}

async function seedUsers() {
  const managers = [];
  const employees = [];
  const passwordHash = await bcrypt.hash("LeaveOff@123", 10);

  for (let i = 0; i < 3; i += 1) {
    const name = `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`;
    managers.push({
      name,
      email: buildEmail(name, i + 1),
      username: buildUsername(name, i + 1),
      passwordHash,
      role: "manager",
    });
  }

  const managerDocs = await User.insertMany(managers);

  for (let i = 0; i < 20; i += 1) {
    const name = `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`;
    const manager = pickRandom(managerDocs);
    employees.push({
      name,
      email: buildEmail(name, i + 10),
      username: buildUsername(name, i + 10),
      passwordHash,
      role: "employee",
      managerId: manager._id,
    });
  }

  const employeeDocs = await User.insertMany(employees);

  const superadminName = "Super Admin";
  const superadmin = await User.create({
    name: superadminName,
    email: "superadmin@leaveoff.dev",
    username: "superadmin",
    passwordHash,
    role: "superadmin",
  });

  return { managers: managerDocs, employees: employeeDocs, superadmin };
}

async function seedLeaveTypes() {
  return LeaveType.insertMany(LEAVE_TYPES);
}

async function seedLeaveRequests(users, leaveTypes) {
  const statuses = ["Pending", "Approved", "Rejected"];
  const approvedTotals = new Map();
  const requests = [];
  const auditLogs = [];

  const year = new Date().getUTCFullYear();

  const totalRequests = 25 + Math.floor(Math.random() * 6);

  for (let i = 0; i < totalRequests; i += 1) {
    const employee = pickRandom(users.employees);
    const leaveType = pickRandom(leaveTypes);
    const status = pickRandom(statuses);
    const manager = users.managers.find((doc) =>
      doc._id.equals(employee.managerId)
    );

    const { startDate, endDate } = randomDateRange(year);
    const workingDays = calculateWorkingDays(startDate, endDate);

    const key = `${employee._id.toString()}-${leaveType._id.toString()}`;
    const approvedSoFar = approvedTotals.get(key) || 0;

    if (status === "Approved" && approvedSoFar + workingDays > leaveType.yearlyQuota) {
      continue;
    }

    const request = {
      userId: employee._id,
      leaveType: leaveType._id,
      startDate,
      endDate,
      reason: "Planned leave",
      status,
      appliedTo: manager ? manager._id : users.managers[0]._id,
    };

    if (status === "Approved") {
      request.approvedBy = request.appliedTo;
      request.approvedAt = new Date();
      request.managerComment = "Approved for planned time off.";
      approvedTotals.set(key, approvedSoFar + workingDays);
    }

    if (status === "Rejected") {
      request.managerComment = "Rejected due to workload.";
    }

    requests.push(request);
  }

  const leaveRequestDocs = await LeaveRequest.insertMany(requests);

  for (const request of leaveRequestDocs) {
    auditLogs.push({
      leaveRequestId: request._id,
      action: "CREATED",
      performedBy: request.userId,
      comment: "Request created.",
      timestamp: request.createdAt,
    });

    if (request.status === "Approved") {
      auditLogs.push({
        leaveRequestId: request._id,
        action: "APPROVED",
        performedBy: request.approvedBy,
        comment: request.managerComment || "Approved.",
        timestamp: request.approvedAt,
      });
    }

    if (request.status === "Rejected") {
      auditLogs.push({
        leaveRequestId: request._id,
        action: "REJECTED",
        performedBy: request.appliedTo,
        comment: request.managerComment || "Rejected.",
        timestamp: new Date(),
      });
    }
  }

  await AuditLog.insertMany(auditLogs);

  return leaveRequestDocs.length;
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
  const leaveTypes = await seedLeaveTypes();
  const requestCount = await seedLeaveRequests(users, leaveTypes);
  const approvedRequests = await LeaveRequest.find({ status: "Approved" }).lean();
  const attendanceRecords = buildAttendanceRecords(users, approvedRequests);
  const attendanceDocs = await Attendance.insertMany(attendanceRecords);

  await mongoose.disconnect();

  return { users, leaveTypes, requestCount, attendanceCount: attendanceDocs.length };
}

seed()
  .then((result) => {
    const managerCount = result.users.managers.length;
    const employeeCount = result.users.employees.length;
    console.log(
      `Seeded ${managerCount} managers, ${employeeCount} employees, ${result.requestCount} leave requests, ${result.attendanceCount} attendance records, 1 superadmin.`
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
