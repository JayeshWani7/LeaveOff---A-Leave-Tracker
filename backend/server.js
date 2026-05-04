const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const leaveRequestRoutes = require("./routes/leaveRequests");
const attendanceRoutes = require("./routes/attendance");
const leaveTypeRoutes = require("./routes/leaveTypes");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const { requireAuth } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required to start the server.");
  process.exit(1);
}

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", requireAuth, leaveRequestRoutes);
app.use("/api", requireAuth, attendanceRoutes);
app.use("/api", requireAuth, leaveTypeRoutes);
app.use("/api", requireAuth, userRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
