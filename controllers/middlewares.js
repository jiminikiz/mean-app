module.exports = {
    add: {
        user: (req, res, next) => {
            req.body.user = req.session._id;
            console.log('Middlewares, add user:', req.path, req.body);
            next();
        }
    },
    sanitize: {
        NULL: (req, res, next) => {
            for (let param in req.query) {
                if (req.query[param] === 'null') {
                    req.query[param] = null;
                }
            }
            next();
        }
    }
};
