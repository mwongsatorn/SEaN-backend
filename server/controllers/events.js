const Event = require('../models/Event');
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { eventSchema } = require('../utils/joi')
const { selectDefaultCover } = require('../utils/selectDefaultCover')
const { isDefaultCover } = require('../utils/isDefaultCover')
const { cloudinary } = require('../utils/cloudinary')

module.exports.index = async (req,res) => {
    let filters = { status: 'Approved'}
    let page = null
    let limit = null
    if(req.query.fac) filters.fac = req.query.fac
    if(req.query.dept) filters.dept = req.query.dept
    if(req.query.page) page = req.query.page
    if(req.query.limit) limit = req.query.limit
    const query = await Event.find(filters)
    .select({ approvedBy: 0, comment: 0, status: 0 })
    .populate({
        path: 'createdBy',
        select: ['firstname', 'lastname','profile_img']
    })
    .skip(page ? limit * (parseInt(page) - 1) : 0 )
    .limit(limit ? limit : 0 )
    const foundEvents = query.map(q => q.toObject())
    res.json(foundEvents)
}

module.exports.getEvent = async (req, res) => {
    const {id} = req.params
    const foundEvent = await Event.findById(id)
    .select({ approvedBy: 0, comment: 0, status: 0 })
    .populate({
        path: 'createdBy',
        select: ['_id', 'firstname', 'lastname','profile_img']
    })
    if(!foundEvent) throw new errorHandler('Event not found')
    res.json(foundEvent)
}

module.exports.createEvent = async (req,res) => {
    await eventSchema.validateAsync(req.body)
    const newEvent = new Event(req.body)
    if(req.files.images) newEvent.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    if (req.body.cover_img) newEvent.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        newEvent.cover_img.url = req.files.cover_img[0].path
        newEvent.cover_img.filename = req.files.cover_img[0].filename
    }
    newEvent.createdBy = req.user._id
    await newEvent.save()
    const updatedUser = await User.updateOne({_id: req.user._id},{
        $push: {
            'history.events.recruited': newEvent._id
        }
    })
    if(updatedUser.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.json(newEvent);
}

module.exports.updateEvent = async (req, res) => {
    await eventSchema.validateAsync(req.body)
    const { id } = req.params
    const { cover_img, ...query } = req.body
    const foundEvent = await Event.findOneAndUpdate({_id: id, createdBy: req.user._id}, query, {
        new: true,
        runValidators: true
    })
    if(!foundEvent) throw new errorHandler('Something went wrong', 500)
    if(foundEvent.status == 'Rejected') foundEvent.status = 'Pending'
    if(req.files.images) {
        await foundEvent.images.forEach(image => cloudinary.uploader.destroy(image.filename))
        foundEvent.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    }
    if(isDefaultCover(foundEvent.cover_img.filename) == false) await cloudinary.uploader.destroy(foundEvent.cover_img.filename)
    if (req.body.cover_img) foundEvent.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        foundEvent.cover_img.url = req.files.cover_img[0].path
        foundEvent.cover_img.filename = req.files.cover_img[0].filename
    }
    await foundEvent.save()
    res.end();
}

module.exports.deleteEvent = async(req, res) => {
    const { id } = req.params
    const foundEvent = await Event.findOneAndDelete({_id: id, createdBy: req.user._id})
    if(!foundEvent) throw new errorHandler('Something went wrong', 500)
    await foundEvent.images.forEach(image => cloudinary.uploader.destroy(image.filename))
    await cloudinary.uploader.destroy(foundEvent.cover_img.filename)
    const updatedUser = await User.updateOne({_id: req.user._id}, {
        $pull: {'history.events.recruited': foundEvent._id}
    })
    if(updatedUser.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end();
}

module.exports.applyEvent = async (req, res) => {
    const { id } = req.params
    const foundEvent = await Event.findByIdAndUpdate(id, {
        $push: { member_list: req.user._id }
    }, { 
        new: true, runValidators: true 
    })
    if(foundEvent.member_amount == foundEvent.current_member) {
        foundEvent.status = 'Completed'
        await foundEvent.save();
    }
    const updatedUser = await User.updateOne({_id: req.user._id}, {
        $push: { 'history.events.participated': id }
    })
    if(updatedUser.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end();
}

module.exports.cancelEvent = async (req,res) => {
    const { id } = req.params
    const foundUser = await User.findOneAndUpdate({
        _id: req.user._id,
        'history.events.participated': id
    },{
        $pull: { 'history.events.participated': id }
    })
    if(!foundUser) throw next(new errorHandler('You did not apply to this event', 401)) 
    const updatedEvent = await Event.updateOne({_id: id}, {
        $pull: { member_list: req.user._id }
    })
    if(updatedEvent.nModified == 0) throw next(new errorHandler('Something went wrong'))
    res.end();
}