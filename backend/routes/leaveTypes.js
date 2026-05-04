const express = require("express");

const { getLeaveTypes } = require("../controllers/leaveTypesController");

const router = express.Router();

router.get("/leave-types", getLeaveTypes);

module.exports = router;
