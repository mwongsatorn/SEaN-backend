const Announcement = require('../models/Announcement')

module.exports.index = async (req, res) => {
    const announcements = await Announcement.find();
    res.json(announcements)
}

module.exports.getAnnouncement = async (req, res) => {
    const {id} = req.params
    const foundAnnouncement = await Announcement.findById(id)
    res.json(foundAnnouncement)
}