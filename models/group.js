var mongoose = require('mongoose'),
    GroupSchema = new mongoose.Schema({
        tag:   {
            type: String,
            unique: true,
            required: true
        },
        label: {
            type: String,
            unique: true,
            required: true
        },
        enabled: {
            type: Boolean,
            required: true,
            default: false
        }
    });

module.exports = mongoose.model('Group', GroupSchema, 'groups');
