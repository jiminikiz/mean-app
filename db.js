const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = (config, callback) => {
  mongoose.connect(`mongodb://${config.host}/${config.name}`, (error) => {
    if(!error) {
      console.info('Mongoose connected to MongoDB successfully'.yellow);
      return callback? callback(null) : null;
    }
    console.error('ERROR starting mongoose!', error);
    return callback? process.exit(128) : callback(error);
  });
};
