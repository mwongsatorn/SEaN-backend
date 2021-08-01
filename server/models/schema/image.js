const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: {
        type: String,
    },
    filename: {
        type: String
    }
}, {
    _id: false,
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    }
})

imageSchema.virtual('thumbnail').get(function() {
    if(this.url) return this.url.replace('.png','.jpg')
})



module.exports = imageSchema