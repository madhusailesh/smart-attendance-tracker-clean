const Attendance = require("../models/Attendance");
const Schedule = require("../models/Schedule");
const User = require("../models/User");

// 1. Mark Absent, Extra, or Cancel
exports.markAttendance = async (req, res) => {
  try {
    const { date, subject, status } = req.body;
    const userId = req.user.id;

    let record = await Attendance.findOne({
      user: userId,
      date: new Date(date),
      subject,
    });

    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = new Attendance({
        user: userId,
        date: new Date(date),
        subject,
        status,
        isManual: true,
      });
      await record.save();
    }
    res.json({ msg: `Marked as ${status}`, record });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// 2. Mark Day Cancelled (Ab ye getStats se bahar hai ✅)
exports.markDayCancelled = async (req, res) => {
  try {
    const { date, subjects } = req.body;
    const userId = req.user.id;

    const promises = subjects.map((sub) => {
      return Attendance.findOneAndUpdate(
        { user: userId, date: new Date(date), subject: sub },
        { status: "Cancelled", isManual: true },
        { upsert: true, new: true }
      );
    });

    await Promise.all(promises);
    res.json({ msg: "All classes for today marked as Cancelled" });
  } catch (err) {
    res.status(500).send("Error marking holiday");
  }
};

// 3. Get Live Stats
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.semesterStart)
      return res.status(400).json({ msg: "Please set semester dates first" });

    const today = new Date();
    const startDate = new Date(user.semesterStart);

    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const schedules = await Schedule.find({ user: userId });

    let totalExpectedClasses = 0;
    for (let i = 0; i <= diffDays; i++) {
      let d = new Date(startDate);
      d.setDate(d.getDate() + i);
      let dayName = d.toLocaleString("en-us", { weekday: "long" });

      let daySchedule = schedules.find((s) => s.day === dayName);
      if (daySchedule) {
        totalExpectedClasses += daySchedule.classes.length;
      }
    }

    const manualRecords = await Attendance.find({ user: userId });
    const absents = manualRecords.filter((r) => r.status === "Absent").length;
    const cancelled = manualRecords.filter((r) => r.status === "Cancelled").length;
    const extras = manualRecords.filter((r) => r.status === "Extra").length;

    const finalTotalClasses = totalExpectedClasses - cancelled + extras;
    const attendedClasses = finalTotalClasses - absents;

    const percentage = finalTotalClasses > 0 ? (attendedClasses / finalTotalClasses) * 100 : 100;

    res.json({
      attendancePercentage: percentage.toFixed(2),
      totalClasses: finalTotalClasses,
      attended: attendedClasses,
      absents: absents,
      lowAttendance: percentage < user.attendanceThreshold,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Stats Calculation Error");
  }
};