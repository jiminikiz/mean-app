const Account = require('../models/account');
const bcrypt = require('bcrypt'); // used for encryption
const errors = { // response errors
  general: {
    status: 500,
    message: 'Backend error'
  },
  users: {
    duplicate: {
      status: 409,
      message: 'Account already exists with that email address.'
    }
  },
  login: {
    status: 403,
    message: 'Invalid username or password'
  },
  forbidden: {
    status: 403,
    message: 'Forbidden'
  }
},
messages = {
  login: {
    status: 200,
    message: 'Login success'
  },
  register: {
    status: 200,
    message: 'Register success'
  }
};

module.exports = {
  middlewares: {
    protect: (req, res, next) => {
      if(req.session.user && req.session.user.enabled) {
        next();
      } else {
        res.redirect('/login');
      }
    },
    session: (req, res, next) => {
      if(req.session.user) {
        return res.redirect('/dashboard');
      }
      next();
    }
  },
  logout: (req, res) => {
    req.session.reset(); // clears the users cookie session
    res.redirect('/login');
  },
  login: (req, res) => {
    Account.findOne({
      email: req.body.email // sent from the frontend in a POST request
    }, (err, user) => {
      // If there was an error in mongo, send back a 500 response (general server error) to the Frontend
      if (err) {
        console.error('MongoDB error:', err);
        res.status(errors.general.status).json(errors.general);
      }
      if (!user) {
        // If there was no user found for the given user name, send back a 403 response (forbidden)
        res.status(errors.login.status).json(errors.login);
      } else {
        console.info('auth.login.user =', user);
        // If we got this far, then we know that the user exists. But did they put in the right password?
        bcrypt.compare(req.body.password, user.password, (bcryptErr, matched) => {
          if (bcryptErr) {
            console.error('Error decrypting password:', bcryptErr);
            res.status(errors.gneral.status).json(errors.general);
          } else if (!matched) {
            console.warn('Passwords do not match for:', user);
            res.status(errors.login.status).json(errors.login);
          } else {
            req.session.user = user; // set the user in the session!
            res.json(messages.login); // send a success message
          }
        });
      }
    });
  },
  register: (req, res) => {
    new Account(req.body).save((err, user) => {
      if(err) {
        console.error('#ERROR#'.bold.red, err.message);
        if(err.code === 11000) {
          res.status(errors.users.duplicate.status).json(errors.users.duplicate);
        } else {
          res.status(errors.general.status).json(errors.general);
        }
      } else {
        req.session.uid = user._id; // set the user in the session!
        res.json(messages.register); // send a success message
      }
    });
  },
  session: (req, res) => {
    if(res.session) {
      return res.json(req.session.user);
    }
    res.status(errors.forbidden.status).json(errors.forbidden);
  }
};
