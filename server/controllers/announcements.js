const Announcement = require('../models/Announcement')

module.exports.index = async (req, res) => {
    const query = await Announcement.find().populate({
        path: 'createdBy',
        select: ['_id', 'firstname', 'lastname', 'profile_img']
    })
    const foundAnns = query.map(q => q.toObject())
    res.json(foundAnns)
}

module.exports.getAnnouncement = async (req, res) => {
    const {id} = req.params
    const foundAnn = await Announcement.findById(id).populate({
        path: 'createdBy',
        select: ['_id', 'firstname', 'lastname', 'profile_img',]
    })
    res.json(foundAnn.toObject())
}