var mongoose = require('mongoose'),
    GroupSchema = new mongoose.Schema({
        label: { type: String, unique: true, required: true }
    });

module.exports = mongoose.model('Group', GroupSchema, 'groups');
