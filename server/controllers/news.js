const News = require('../models/News')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { newsSchema } = require('../utils/joi')


module.exports.index = async (req,res) => {
    const foundNews = await News.find({status: 'Approved'}).populate({
        path: 'createdBy',
        select: ['firstname', 'lastname','profile_img']
    })
    res.json(foundNews)
}

module.exports.createNews = async (req, res) => {
    await newsSchema.validateAsync(req.body)
    const news = new News(req.body)
    await news.save();
    await User.updateOne({_id: req.user._id},{
        $push: { 'history.news': news._id }
    })
    res.end()
}

module.exports.getNews = async (req, res) => {
    const {id} = req.params
    const foundNews = await News.findById(id)
    res.json(foundNews)
}

module.exports.updateNews = async (req, res) => {
    await newsSchema.validateAsync(req.body)
    const {id} = req.params
    const foundNews = await News.findByIdAndUpdate({_id: id, createdBy: req.user._id,})
    if(!foundNews) return new errorHandler('You do not have permission to edit this news', 401)
    News.updateOne({_id: id}, req.body)
    res.end();
}

module.exports.deleteNews = async (req, res) => {
    const {id} = req.params
    const foundNews = await News.findOneAndDelete({_id: id, createdBy: req.user._id})
    if(!foundNews) return new errorHandler('You do not have permission to delete this news', 401)
    res.end();
}