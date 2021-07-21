const mongoose = require('mongoose')
const Schema = mongoose.Schema

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cover_img: {
        type: String
    },//No Image for ann
    images: [{
        type: String
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Announcement', announcementSchema)