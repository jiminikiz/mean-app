'use strict'

var Auth = require('./controllers/auth'),
    CRUD = require('./controllers/crud'),
    Render = require('./controllers/render'),
    Middlewares = require('./controllers/middlewares');

module.exports = function(app) {
    Render.init(app.get('views'));

    // SITE ROOT
    app.get('/', (req, res) => { // replace this route with a landing or home page, or break this out into another controller if needed!
        res.render('home');
    });
    app.get('/login', Auth.render); // route for the login page
    app.get('/logout', Auth.logout); // route for logging out

    app.post('/login', Auth.login); // form request emdpoint for loggin in
    app.post('/register', Auth.register); // form request endpoint for user registration

    // DAHSBOARD

    app.put('/api/users/:id', Auth.admin, Users.update);

    // API :: CRUD
    app.route('/api/:model*')
        .all(CRUD.middlewares.params)
    app.route('/api/:model')
        .get(CRUD.read)
        .post(CRUD.create)
    app.route('/api/:model/:id')
        .get(CRUD.read)
        .put(CRUD.update)
        .delete(CRUD.delete);

    app.all('/dashboard*', Auth.protect); // protect all dashboard routes from unauthorized users

    app.get('*', Render.session);

    app.use(express.static('public'));
};
