'use strict'

var Auth = require('./auth')

module.exports = function(app) {
    // SITE ROOT
    app.get('/', (req, res) => { // replace this with a landing or home page
        if( req.session.user ) {
            res.redirect('/dashboard')
        } else {
            res.redirect('/login')
        }
    })

    app.get('/login', Auth.render) // route for the login page
    app.get('/logout', Auth.logout) // route for logging out

    app.post('/login', Auth.login) // form request emdpoint for loggin in
    app.post('/register', Auth.register) // form request endpoint for user registration

    // DAHSBOARD
    app.all('/dashboard*', Auth.session) // protect all dashboard routes from unauthorized users
    app.get('/dashboard', (req, res) => { // renders the dashboard
        res.render('dashboard.html', req.session)
    })
}
