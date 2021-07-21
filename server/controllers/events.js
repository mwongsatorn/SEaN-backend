const Event = require('../models/Event');
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { eventSchema } = require('../utils/joi')

module.exports.index = async (req,res) => {
    let filters = { status: 'Approved'}
    let page = null
    let limit = null
    if(req.query.fac) filters.fac = req.query.fac
    if(req.query.dept) filters.dept = req.query.dept
    if(req.query.page) page = req.query.page
    if(req.query.limit) limit = req.query.limit
    const events = await Event.find(filters)
    .select({ approvedBy: 0, comment: 0, status: 0 })
    .populate({
        path: 'createdBy',
        select: ['firstname', 'lastname', 'profile_img']
    }).skip(page ? limit * (parseInt(page) - 1) : 0 )
    .limit(limit ? limit : 0 )

    res.json(events)
}

module.exports.getEvent = async (req, res) => {
    const {id} = req.params
    const foundEvent = await Event.findById(id)
    .select({ approvedBy: 0, comment: 0, status: 0 })
    .populate({
        path: 'createdBy',
        select: ['firstname', 'lastname', 'profile_img']
    })
    if(!foundEvent) throw new errorHandler('Event not found')
    res.json(foundEvent)
}

module.exports.createEvent = async (req,res) => {
    await eventSchema.validateAsync(req.body)
    const newEvent = new Event(req.body)
    if(req.files.images) newEvent.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    if(req.files.cover_img) {
        newEvent.cover_img.url = req.files.cover_img[0].path
        newEvent.cover_img.filename = req.files.cover_img[0].filename
    }
    newEvent.createdBy = req.user._id
    await newEvent.save()
    await User.updateOne({_id: req.user._id},{
        $push: {
            'history.event.recruited': newEvent._id
        }
    })
    
    res.json(newEvent);
}

module.exports.updateEvent = async (req, res) => {
    await eventSchema.validateAsync(req.body)
    const { id } = req.params
    const foundEvent = await Event.findOneAndUpdate({_id: id, createdBy: req.user._id}, req.body)
    if(!foundEvent) throw new errorHandler('Something went wrong', 500)
    res.end();
}

module.exports.deleteEvent = async(req, res) => {
    const { id } = req.params
    const foundEvent = await Event.findOneAndDelete({_id: id, createdBy: req.user._id})
    if(!foundEvent) throw new errorHandler('Something went wrong', 500)
    foundEvent.images.forEach(image => {
        await cloudinary.uploader.delete(image.filename)
    })
    await cloudinary.uploader.delete(foundEvent.cover_img.filename)
    await User.updateOne({_id: req.user._id}, {
        $pull: {'history.event.recruited': foundEvent._id}
    })
    res.end();
}

module.exports.applyEvent = async (req, res) => {
    const { id } = req.params
    const foundEvent = await Event.findByIdAndUpdate(id, {
        $push: {member_list: req.user._id},
        $inc: {current_member: 1}
    })
    if(foundEvent.member_amount == foundEvent.current_member) {
        foundEvent.status = 'Completed'
        await foundEvent.save();
    }
    await User.updateOne({_id: req.user._id}, {
        $push: {'history.event.participated': id}
    })
    res.end();
}

module.exports.cancelEvent = async (req,res) => {
    const {id} = req.params
    const foundUser = await User.findOneAndUpdate({
        _id: req.user._id,
        'history.event.participated': {$in: id}
    },{
        $pull: {'history.event.participated': id}
    } )
    if(!foundUser) throw next(new errorHandler('You did not apply to this event', 401)) 
    await Event.updateOne({_id: id}, {
        $pull: {member_list: req.user._id}
    })
    res.end();
}