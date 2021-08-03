const News = require('../models/News')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { newsSchema } = require('../utils/joi')
const { selectDefaultCover } = require('../utils/selectDefaultCover')
const { isDefaultCover } = require('../utils/isDefaultCover')
const { cloudinary } = require('../utils/cloudinary')

module.exports.index = async (req,res) => {
    const query = await News.find({status: 'Approved'})
    .populate({
        path: 'createdBy',
        select: ['_id', 'firstname', 'lastname','profile_img'],
    })
    const foundNews = query.map(q => q.toObject())
    res.json(foundNews)
}

module.exports.createNews = async (req, res) => {
    await newsSchema.validateAsync(req.body)
    const newNews = new News(req.body)
    if(req.files.images) newNews.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    if (req.body.cover_img) newNews.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        newNews.cover_img.url = req.files.cover_img[0].path
        newNews.cover_img.filename = req.files.cover_img[0].filename
    }
    newNews.createdBy = req.user._id
    await newNews.save();
    const updatedUser = await User.updateOne({_id: req.user._id},{
        $push: { 'history.news': newNews._id }
    })
    if(updatedUser.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end()
}

module.exports.getNews = async (req, res) => {
    const {id} = req.params
    const foundNews = await News.findById(id)
    .populate({
        path: 'createdBy',
        select: ['_id', 'firstname', 'lastname','profile_img'],
    })
    res.json(foundNews.toObject())
}

module.exports.updateNews = async (req, res) => {
    await newsSchema.validateAsync(req.body)
    const {id} = req.params
    const { cover_img, ...query } = req.body
    const foundNews = await News.findByIdAndUpdate({_id: id, createdBy: req.user._id}, query, {
        new: true, 
        runValidators: true
    })
    if(!foundNews) return new errorHandler('You do not have permission to edit this news', 401)
    if(foundNews.status == 'Rejected') foundEvent.status = 'Pending'
    if(req.files.images) {
        await foundNews.images.forEach(image => cloudinary.uploader.destroy(image.filename))
        foundNews.images = req.files.images.map(image => ({url: image.path, filename: image.filename}))
    }
    if(isDefaultCover(foundNews.cover_img.filename) === false) await cloudinary.uploader.destroy(foundNews.cover_img.filename)
    if (req.body.cover_img) newNews.cover_img = selectDefaultCover(req.body.cover_img)
    if(req.files.cover_img) {
        foundNews.cover_img.url = req.files.cover_img[0].path
        foundNews.cover_img.filename = req.files.cover_img[0].filename
    }
    await foundNews.save()
    res.end();
}

module.exports.deleteNews = async (req, res) => {
    const {id} = req.params
    const foundNews = await News.findOneAndDelete({_id: id, createdBy: req.user._id})
    if(!foundNews) return new errorHandler('Something went wrong', 401)
    await foundNews.images.forEach(image => cloudinary.uploader.destroy(image.filename))
    await cloudinary.uploader.destroy(foundNews.cover_img.filename)
    const updatedUser = await User.updateOne({_id: req.user._id},{
        $pull: { 'history.news': foundNews._id }
    })
    if(updatedUser.nModified == 0) throw new errorHandler('Something went wrong', 500)
    res.end()
}