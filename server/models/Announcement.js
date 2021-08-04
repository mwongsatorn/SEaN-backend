const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = require('./schema/image')

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
        type: imageSchema,
        default: () => ({})
    },
    images: [{
        type: imageSchema,
        default: () => ({})
    }]
}, {
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    },
    timestamps: true
})

module.exports = mongoose.model('Announcement', announcementSchema)