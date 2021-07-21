const Event = require('../models/Event');
const News = require('../models/News');
const errorHandler = require('../utils/errorHandler')
const Announcement = require('../models/Announcement');

module.exports.pendingEvents = async (req,res) => {
    const foundEvent = await Event.find({status: 'Pending'})
    res.json(foundEvent)
}

module.exports.changeEventStatus = async (req,res) => {
    const {id} = req.params
    await Event.findByIdAndUpdate(id, {
        status: req.body.status,
        comment: req.body.comment,
        approvedBy: req.user._id
    })
    res.end();
}

module.exports.pendingNews = async (req,res) => {
    const foundNews = await News.find({status: 'Pending'})
    res.json(foundNews)
}


module.exports.changeNewsStatus = async (req,res) => {
    const {id} = req.params
    await News.findByIdAndUpdate(id,{
        status: req.body.status,
        comment: req.body.comment,
        approvedBy: req.user._id
    })
    res.end();
}

module.exports.createAnnouncement = async (req,res) => {
    const announcement = new Announcement({
        title: req.body.name,
        description: req.body.description,
        createdBy: req.user._id,
    })
    if(req.files.images) newEvent.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    if(req.files.cover_img) {
        newEvent.cover_img.url = req.files.cover_img[0].path
        newEvent.cover_img.filename = req.files.cover_img[0].filename
    }
    await announcement.save()
    res.end();
}

module.exports.updateAnnouncement = async (req,res) => {
    const {id} = req.params
    await Announcement.findByIdAndUpdate(id,req.body)
    res.end();
}

module.exports.deleteAnnouncement = async (req,res) => {
    const {id} = req.params
    await Announcement.findByIdAndDelete(id)
    res.end();
}