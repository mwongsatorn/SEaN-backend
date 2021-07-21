const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
    event: {
        participated: [{
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }],
        recruited: [{
            type: Schema.Types.ObjectId,
            ref: 'Activity'
        }],
    },
    news: [{
        type: Schema.Types.ObjectId,
        ref: 'News'
    }]      
})

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 8,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    status_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Student','Staff'],
        required: true
    },
    faculty: {
        type: String,
        required: true,
        default: '-'
    },
    department: {
        type: String,
        required: true,
        default: '-'
    },
    tel_no: {
        type: String,
        required: true,
    },
    profile_img: {
        type: String,
        default: 'https://southernplasticsurgery.com.au/wp-content/uploads/2013/10/user-placeholder.png'
    },
    history: historySchema,
    role: {
        type: String,
        default: "User",
    },
    refresh_token: {
        type: String,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("User",userSchema);