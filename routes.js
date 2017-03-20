const express = require('express');
const Auth = require('./controllers/auth');
const CRUD = require('./controllers/crud');
const Render = require('./controllers/render');
// const Middlewares = require('./controllers/middlewares');

module.exports = (app) => {
    Render.init(app.get('views'));

    // SITE ROOT
    app.get('/login', Auth.middlewares.session);
    app.get('/logout', Auth.logout); // route for logging out

    app.post('/login', Auth.login); // form request emdpoint for loggin in
    app.post('/register', Auth.register); // form request endpoint for user registration

    // API::CRUD
    app.route('/api/:model*')
        .all(CRUD.middlewares.params);
    app.route('/api/:model')
        .get(CRUD.read)
        .post(CRUD.create);
    app.route('/api/:model/:id')
        .get(CRUD.read)
        .put(CRUD.update)
        .delete(CRUD.delete);

    // DAHSBOARD
    app.all('/dashboard*', Auth.middlewares.protect); // protect all dashboard routes from unauthorized users

    app.get('*', Render.session);

    app.use(express.static('public'));
};
