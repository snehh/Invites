const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../models/Schema').user
const Event = require('../models/Schema').event

const { ensureAuthenticated } = require('../config/auth')

router.get('/new', ensureAuthenticated, (req, res) =>{
    var user = req.user
    res.render('createnew', { 
        errors: '',
        name: '',
        body: '',
        footer:''
    })
})

router.get('/myevent/view/:id',ensureAuthenticated, async (req, res) => {
    var event = await Event.findById(req.params.id)
    setTimeout(() => {
        if(event == null) res.redirect('/homepage')
        res.render('viewmyevent', {event})
    },500)
})

router.get('/show/:id', ensureAuthenticated, async (req, res) => {
    var user = req.user;
    var event = await Event.findById(req.params.id)
    setTimeout(() => {
        if(event == null) res.redirect('/homepage')
        res.render('viewinvite', {event})
    },500)
})

router.get('/accepted/:id', ensureAuthenticated, async (req, res) => {
    var user = req.user;
    var event = await Event.findById(req.params.id)
    setTimeout(() => {
        if(event == null) res.redirect('/homepage')
        res.render('accinvite', {event})
    },500)

})


router.post('/new', (req, res, next) => {
    const {name, date, body, footer, priv} = req.body;
    var errors = [];
    if(!name || !date|| !body)
        errors.push("Fill required fields")
    if( (new Date(date).getTime()) < Date.now() )
        errors.push("Select a date after today")
    if(errors.length > 0)
        res.render('createnew', {errors, name, body, footer})
    else{
        const newEvent = new Event({
            createdBy: req.user.username,
            title: name,
            date: date,
            markdown: body,
            footer: footer,
            private: priv
        })
        newEvent.save()
            .then(event =>{
                req.user.myEvents.push(newEvent._id)
                req.user.save()
                .then(user => {
                    if(!priv){
                        User.find({}, (err, res) => {
                            if(err) throw err
                            res.forEach(user => {
                                if (String(user._id) !== String(req.user._id)) {
                                    user.allInvitations.push(newEvent._id)
                                    user.save()
                                }
                            })
                        })
                        setTimeout(() => {
                            res.redirect('/homepage/event')
                        }, 500)
                        }
                    
                    else{ 
                        var x=priv.split(" ")
                        x.forEach(username => {
                            User.findOne({username: username}, (err, res) => {
                                if(!err) {
                                    res.allInvitations.push(newEvent._id)
                                    res.save()
                                }
                            })
                        })
                        setTimeout(() => {
                            res.redirect('/homepage/event')
                        }, 500)
                    }
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }
})

router.post('/show/:id/accept', (req, res) => {
    const event_id = req.params.id;
    const user = req.user;
     
    user.allInvitations = user.allInvitations.filter(function(currentid) {
        return currentid !== event_id;
    });

    user.acceptedEvents.push(event_id);
    user.save()
    .then(() => {
        Event.findById(event_id, (err, eve) => {
            if(err) throw err;
            eve.attendees = eve.attendees + 1;
            eve.save()
            .then(() => {
                res.redirect('/homepage/notif');
            })
            .catch(err => {throw err})
        })
    })
    .catch(err => {throw err})
})

router.post('/show/:id/decline', (req, res) => {
    const event_id = req.params.id;
    const user = req.user;
     
    user.allInvitations = user.allInvitations.filter(function(currentid) {
        return currentid !== event_id;
    });

    user.save()
    .then(() => {
        Event.findById(event_id, (err, eve) => {
            if(err) throw err;
                res.redirect('/homepage/notif');
        })
    })
    .catch(err => {throw err})
})

module.exports = router