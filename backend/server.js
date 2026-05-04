const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const leaveRequestRoutes = require("./routes/leaveRequests");
const attendanceRoutes = require("./routes/attendance");
const leaveTypeRoutes = require("./routes/leaveTypes");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const { requireAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required to start the server.");
  process.exit(1);
}

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", requireAuth, leaveRequestRoutes);
app.use("/api", requireAuth, attendanceRoutes);
app.use("/api", requireAuth, leaveTypeRoutes);
app.use("/api", requireAuth, userRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    // Explicitly enable TLS and use the system CA store.
    // This resolves "tlsv1 alert internal error" on Node 18+ with Atlas.
    tls: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => {
      app.listen(PORT, '0.0.0.0' , () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

