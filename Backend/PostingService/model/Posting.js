var mongoose = require('mongoose');
var Schema = mongoose.Schema


var PostingSchema = new Schema({

    creator:{type:String, require: true,  ref: 'User' },
    emotion: String,
    contend: String, 
    hashtag: String,
    created: {type: Date, defauly: Date.now}

});

module.exports = mongoose.model('Posting', PostingSchema);