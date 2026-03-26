const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        const { semesterStart, semesterEnd, attendanceThreshold } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { semesterStart, semesterEnd, attendanceThreshold },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).send("Profile Update Error");
    }
};