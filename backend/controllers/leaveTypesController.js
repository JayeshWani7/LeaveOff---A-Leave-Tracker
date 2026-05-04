const { LeaveType } = require("../models");

async function getLeaveTypes(req, res) {
  try {
    const leaveTypes = await LeaveType.find({}).sort({ name: 1 }).lean();
    return res.status(200).json(leaveTypes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getLeaveTypes,
};
