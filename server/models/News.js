const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = require('./schema/image')

const newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    short_description: {
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
    images: [ imageSchema ],
    status: {
        type: String,
        enum: ['Pending','Approved','Rejected'],
        default: 'Pending'
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    comment: {
        type: String,
        default: ''
    }   
}, {
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    },
    timestamps: true
})


module.exports = mongoose.model('News', newsSchema)