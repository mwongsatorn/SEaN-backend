const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = require('./schema/history')
const imageSchema = require('./schema/image')

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 8,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255,
    },
    firstname: {
        type: String,
        maxlength: 255,
    },
    lastname: {
        type: String,
        maxlength: 255,
    },
    email: {
        type: String,
        unique: true,
        maxlength: 255,
    },
    status_id: {
        type: String,
        maxlength: 255,
    },
    status: {
        type: String,
        enum: ['Student','Staff'],
    },
    faculty: {
        type: String,
        default: '-',
        maxlength: 255,
    },
    department: {
        type: String,
        default: '-',
        maxlength: 255,
    },
    tel_no: {
        type: String,
        maxlength: 255,
    },
    profile_img: {
        type: imageSchema,
        default: () => ({url: 'https://res.cloudinary.com/dgizzny4y/image/upload/v1628008702/S-E-a-N/default/profile_img_k5vcfw.jpg'})
    },
    history: {
        type: historySchema,
        default: () => ({})
    },
    role: {
        type: String,
        default: "User",
    },
    refresh_token: {
        type: String,
    }
}, {
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    },
    timestamps: true,
});


module.exports = mongoose.model("User",userSchema);