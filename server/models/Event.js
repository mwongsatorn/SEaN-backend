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

const eventSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String,
        maxlength: 4000,
        default: ""
    },
    type: {
        type: String,
        enum: ['Force','Regular','Volunteer','Others']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    faculty: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    location: {
        type: String,
    },
    cover_img: imageSchema,
    images: [ imageSchema ],
    member_amount: {
        type: Number,
    },
    member_list: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isAvailable: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending','Approved','Rejected','Completed'],
        default: 'Pending'
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
    },
    comment: {
        type: String,
    }
    
}, {
    timestamps: true
})

eventSchema.virtual('current_member').get(function() {
    return this.member_list.length
})

eventSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model("Event",eventSchema)