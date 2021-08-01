const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = require('./schema/image')

const eventSchema = new Schema({
    title: {
        type: String,
        maxlength: 255
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
        default: ""
    },
    cover_img: {
        type: imageSchema,
        default: () => ({})
    },
    images: [{
        type: imageSchema,
        default: () => ({})
    }],
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
    toObject: {
        getters: true
    },
    toJSON : {
        getters: true
    },
    timestamps: true
})

eventSchema.virtual('current_member').get(function() {
    return this.member_list.length
})

eventSchema.set('toObject', { getters: true })

module.exports = mongoose.model("Event",eventSchema)