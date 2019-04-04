const SALT = 10;
const Validators = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AccountSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group'
  },
  email: {
    type: String,
    validate: {
      message: '{VALUE} is not a valid email address!',
      validator: (value) => {
        return Validators.email.test(value);
      }
    },
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  names: {
    first:  {
      type: String
    },
    middle: {
      type: String
    },
    last:   {
      type: String
    }
  },
  image: {
    type: String
  },
  phone: {
    type: Number
  },
  address: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now,
    set: () => this.securedField
  }
});

// hash passwords before saving them
AccountSchema.pre('save', function(signUpForm, next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if(user.isNew || user.isModified('password')) {
    return AccountModel.hashPassword(user.password, (err, hashed) => {
      if(err) {
        console.error('[models.user.hashPassword.error]:', err);
      }
      user.password = hashed;
      next();
    });
  }

  next();
});

const AccountModel = mongoose.model('Account', AccountSchema, 'accounts');

AccountModel.hashPassword = (password, callback) => {
  bcrypt.hash(password, SALT, (err, hashedPassword) => {
    // hash the password using our salt constant
    if (err) {
      return callback(err);
    }
    callback(hashedPassword);
  });
};

module.exports = AccountModel;
