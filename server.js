const express = require("express")
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require('passport')

const accountRouter = require('./routes/dashboard')
const loginRouter = require('./routes/user')
const eventRouter = require('./routes/event')
const db = require('./config/keys').MongoURI
require('./config/passport')(passport)

const app = express()

mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("not connected " + err))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').urlencoded({ extended: true }))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))

//Routes
app.use('/users', loginRouter)
app.use('/homepage', accountRouter)
app.use('/homepage/event', eventRouter)
app.get('/', (req, res) => {
    res.redirect('/users/login')
})
app.get('*', (req, res) => {
    res.render('error')
})

console.log("Listening to port 3000)
app.listen(3000)
