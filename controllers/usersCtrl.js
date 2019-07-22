const db = require('../models');
const bcrypt = require('bcryptjs');

const createUser = (req, res) => {
    const errors = [];
    if (!req.body.email) {
        errors.push({ field: 'email', message: 'Did not enter a valid email' });
    }

    if (!req.body.password) {
        errors.push({ field: 'password', message: 'Did not enter a valid password' })
    }

    if (errors.length) {
        return res.render('users/login', { errors })
    }

    // Generate Hashed Password
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return res.render(`/users/signup`, { errors: [{ message: 'Something went wrong. Try Again' }] })

        bcrypt.hash(req.body.password, salt, (error, hash) => {
            if (error) return res.render('users/signup', { errors: [{ message: 'Something went wrong. Try again' }] });
            req.body.password = hash;

            db.User.create(req.body, (error, createdUser) => {
                if (error) return console.log(error);
                res.json({
                    data: createdUser
                })
            })
        })

    });

}

const newSession = (req, res) => {
    res.render('users/login');
}
const createSession = (req, res) => {
    const errors = [];
    if (!req.body.email) {
        errors.push({
            field: 'email',
            message: 'Please enter a valid email'
        })
    }
    if (!req.body.password) {
        errors.push({
            field: 'password',
            message: 'Please enter a valid password'
        })
    }

    if (errors.length) {
        return res.render(`users/login`, { errors })
    }

    db.User.findOne({ email: req.body.email }, (error, foundUser) => {
        if (error) return res.render(`users/login`, { errors: [{ message: `Something went wrong. Try again` }] });
        if (!foundUser) return res.render(`users/login`, { errors: [{ message: `Invalid username and/or password` }] });
    })

    bcrypt.compare(req.body.password, foundUser.password, (error, match) => {
        if (error) return res.render(`users/login`, { errors: [{ message: `Something went wrong` }] });
        if (!match) return res.render(`users/login`, { errors: [{ message: `Invalid username and/or password` }] });
        if (match) {
            req.session.currentUser = { _id: foundUser._id, name: foundUser.name, email: foundUser.email }
            return res.render(`profile/show`)
        }
    })
}

const newUser = (req, res) => {
    res.render(`users/signup`);
}

module.exports = {
    createUser,
    newSession,
    createSession,
    newUser
}