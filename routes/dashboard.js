const express = require('express')
const passport = require('passport')
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../config/keys').MongoURI

const User = require('../models/Schema').user
const Event = require('../models/Schema').event
const { ensureAuthenticated } = require('../config/auth')

mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("not connected " + err))


router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('/homepage/event')
})

router.get('/event', ensureAuthenticated, async (req, res) => {
    const currentUser = req.user;
    var arr = currentUser.myEvents
    var events = []

        
                arr.forEach(event_id => {
                    
                Event.findById(event_id, (err, eve) => {
                    if(err) throw err;
                    events.push(eve)
                    })
                })
            
                setTimeout(() => {
                    res.render('home', {
                        user: req.user,
                        events
                    })
                }, 1000)
    
})
router.get('/notif', ensureAuthenticated, (req, res) => {
    var arr = req.user.allInvitations
    var events = []
    arr.forEach(event_id => {
        Event.findById(event_id, (err, eve) => {
            if(err) throw err;
            events.push(eve)
        })
    })

    setTimeout(() => {
        res.render('notifications', {
            events
        })
    }, 500)
        
})

router.get('/accepted', ensureAuthenticated, (req, res) => {
    const currentUser = req.user;
    var arr = currentUser.acceptedEvents;
    var events = []

    arr.forEach(event_id => {
                    
                Event.findById(event_id, (err, eve) => {
                    if(err) throw err;
                    events.push(eve)
                    })
                })
            
                setTimeout(() => {
                    res.render('accepted', {
                        user: req.user,
                        events
                    })
                }, 500)
})

module.exports = router