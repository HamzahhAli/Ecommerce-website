const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('../models/User');
const sendEmail = require('../utils/email'); 
const initializePassport = require('../passport-config');

initializePassport(
    passport,
    async email => await User.findOne({ email: email }),
    async id => await User.findById(id)
);

router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
};

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { message: req.flash('error') });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
}));

router.get('/create', checkNotAuthenticated, (req, res) => {
    res.render('create');
});

router.post('/create', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await user.save();


        await sendEmail(user.email, 'Welcome to Our Service', `Hello ${user.name},\n\nThank you for registering!\n\nBest regards,\nYour Team`);

        res.redirect('/account/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.redirect('/account/create');
    }
});

router.delete('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/account/login');
    });
});

module.exports = router;
