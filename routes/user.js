const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const router = express.Router()

const { forwardAuthenticated } = require('../config/auth');
const User = require('../models/Schema').user

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', {
        message: ''
    })
});

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register', { errors: undefined })
})



router.post('/register', (req, res) =>{
    const { name, username, email, password, password2} = req.body;
    var errors = [];

        if(!email || !name || !password || !password2 || !username)
            errors.push({ msg: 'Fill in all fields' })
        if(password != password2)
            errors.push({ msg: 'Passwords do not match' })
    if (errors.length != 0)
        res.render('register', {errors})
    else{
        User.findOne({username: username})    
        .then(user => {
            if(user){
                error.push({ msg: 'Username taken' })
                res.render('register', { errors})
            }
            else{
                User.findOne({ email: email })
                    .then(user => {
                        if(user){
                            errors.push({ msg: 'Email already registered' })
                            res.render('register', { errors})
                        }
                        else{
                            const newUser = new User({
                                name,
                                username,
                                email,
                                password
                            })
                            
                            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;

                                newUser.password = hash;

                                newUser.save()
                                    .then(user =>{
                                        res.redirect('login')
                                    })
                                    .catch(err => console.log(err))
                            }))
                        }
                    })
                }
        })
    }
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || (!email && !password))
        res.render('login', {message: "Fill in all fields"})

    passport.authenticate('local', function(err, user, info){
       if (err) { return next(err) }
    if (!user) {
      return res.render('login', { message: "Invalid Credentials" })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      module.export = { currentUser: user }
      return res.redirect('/homepage');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout;
    req.session.destroy(function (err) {
        res.redirect('login');
    })
})

module.exports = router