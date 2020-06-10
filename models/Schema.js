const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    myEvents:{
        type: [String]
    },
    acceptedEvents:{
        type: [String]
    },
    allInvitations:{
        type: [String]
    }
})

const eventSchema = new mongoose.Schema({
    createdBy: {
        type: String
    },
    title:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    markdown:{
        type: String,
        required: true
    },
    footer:{
        type: String
    },
    attendees:{
        type: Number,
        default: 0
    },
    private:{
        type: [String],
    }
})

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema)

module.exports = {
    user: User,
    event: Event
}