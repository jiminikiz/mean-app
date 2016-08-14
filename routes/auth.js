'use strict'

var User = require('../models/user'),
    bcrypt = require('bcryptjs'), // used for encryption
    errors = { // response errors
        general: {
            status: 500,
            message: 'Backend error'
        },
        login: {
            status: 403,
            message: 'Invalid username or password'
        }
    };

module.exports = {
    render: (req, res) => {
        res.render('auth.html', req.session); // render the authenticaiton page (register/login)
    },
    logout: (req, res) => {
        req.session.user = null; // clears the users cookie session
        res.redirect('/login');
    },
    login: (req, res) => {
        User.findOne({
            email: req.body.email // sent from the frontend in a POST request
        }, (err, user) => {
            // If there was an error in mongo, send back a 500 response (general server error) to the Frontend
            if (err) {
                console.error('MongoDB error:', err);
                res.status(500).send(errors.general);
            }
            if (!user) {
                // If there was no user found for the given user name, send back a 403 response (forbidden)
                res.status(403).send(errors.login);
            } else {
                console.info('auth.login.user =', user);
                // If we got this far, then we know that the user exists. But did they put in the right password?
                bcrypt.compare(req.body.password, user.password, (bcryptErr, matched)=>{
                    if (bcryptErr) {
                        console.error('Error decrypting password:', bcryptErr);
                        res.status(500).send(errors.general);
                    } else if (!matched) {
                        console.warn('Passwords do not match for:', user);
                        res.status(403).send(errors.login);
                    } else {
                        req.session.user = user; // set the user in the session!
                        delete user.password; // remove the hashed password before sending back the result
                        res.send(user); // send the
                    }
                })
            }
        })
    },
    register: (req, res) => {
        var newUser = new User(req.body)

        newUser.save((err, user) => {
            if(err) {
                console.error('ERROR saving newUser:', err)
                res.status(500).send(errors.general)
            } else {
                req.session.user = user
                res.send(user)
            }
        });
    },
    session: (req, res, next) => {
        if( req.session.user ) {
            next();
        } else {
            res.redirect('/login');
        }
    }
};
