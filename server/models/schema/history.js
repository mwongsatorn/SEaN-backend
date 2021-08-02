const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historySchema = new Schema({
    _id: false,
    events: {
        participated: [{
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }],
        recruited: [{
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }],
    },
    news: [{
        type: Schema.Types.ObjectId,
        ref: 'News'
    }]      
}, {
    _id: false,
    toObject: {
        getters: true
    },
    toJSON: {
        getters: true
    }
})


module.exports = historySchema