const Event = require('../models/Event');
const News = require('../models/News');
const Announcement = require('../models/Announcement');
const errorHandler = require('../utils/errorHandler')
const { selectDefaultCover } = require('../utils/selectDefaultCover')

module.exports.pendingEvents = async (req,res) => {
    const foundEvents = await Event.find({status: 'Pending'})
    .populate({
        path: 'createdBy',
        select: ['_id', 'title']
    })
    res.json(foundEvents)
}

module.exports.changeEventStatus = async (req,res) => {
    const {id} = req.params
    const updatedEvent = await Event.updateOne({ _id: id }, {
        status: req.body.status,
        comment: req.body.comment,
        approvedBy: req.user._id
    })
    if(updatedEvent.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end();
}

module.exports.pendingNews = async (req,res) => {
    const foundNews = await News.find({status: 'Pending'})
    .populate({
        path: 'createdBy',
        select: ['_id', 'title']
    })
    res.json(foundNews)
}

module.exports.changeNewsStatus = async (req,res) => {
    const {id} = req.params
    const updatedNew = await News.updateOne({ _id: id }, {
        status: req.body.status,
        comment: req.body.comment,
        approvedBy: req.user._id
    })
    if(updatedNew.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end();
}

module.exports.createAnnouncement = async (req,res) => {
    const newAnn = new Announcement({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.user._id,
    })
    if(req.files.images) newAnn.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    if(req.body.cover_img) newAnn.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        newAnn.cover_img.url = req.files.cover_img[0].path
        newAnn.cover_img.filename = req.files.cover_img[0].filename
    }
    await newAnn.save()
    res.end();
}

module.exports.updateAnnouncement = async (req,res) => {
    const {id} = req.params
    const foundAnn = await Announcement.findByIdAndUpdate(id,req.body)
    if(!foundAnn) throw new errorHandler('Something went wrong', 500)
    if(req.files.image) {
        foundAnn.images.forEach(async image => await cloudinary.uploader.destroy(image.filename))
        foundAnn.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    }
    if(isDefaultCover(foundEvent.cover_img.filename) == false) await cloudinary.uploader.destroy(foundEvent.cover_img.filename)
    if(req.body.cover_img) foundAnn.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        foundAnn.cover_img.url = req.files.cover_img[0].path
        foundAnn.cover_img.filename = req.files.cover_img[0].filename
    }
    await foundAnn.save()
    res.end();
}

module.exports.deleteAnnouncement = async (req,res) => {
    const {id} = req.params
    const foundAnn = await Announcement.findByIdAndDelete(id)
    if(!foundAnn) throw new errorHandler('Something went wrong', 500)
    await foundAnn.images.forEach(image => cloudinary.uploader.destroy(image.filename))
    await cloudinary.uploader.destroy(foundAnn.cover_img.filename)
    res.end();
}