var mongoose = require('mongoose');
var Schema = mongoose.Schema


var PostingSchema = new Schema({
    creator: String,
    emotion: String,
    content: String, 
    hashtags: [],
    created: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Posting', PostingSchema);