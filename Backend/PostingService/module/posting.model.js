const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postingSchema = new Schema({

    creator:{
        type: String
    },

    content:{
        type: String
    },

    created:{
        type: Date, defauly: Date.now
    },
});

module.exports = mongoose.model('Post', postingSchema);