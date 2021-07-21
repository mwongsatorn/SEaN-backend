const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: {
        type: String,
    },
    filename: {
        type: String
    }
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload','/upload/w_500')
})

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
    cover_img: imageSchema,
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
    timestamps: true
})


module.exports = mongoose.model('News', newsSchema)