var Post = require('../module/posting.model');
var express = require ("express");
var config = require('../config');
const router = express.Router();
//var mongoose = require (mongoose);

router.route('/')
router.post(function(req, res) {
    var posting = new Post({
        creator: req.body.creator,
        content: req.body.content,

    });

   posting.save(function(err) {
        if(err) {
            res.send(err);
            return
        }
        res.json({message: "New Posting Created"});
    });
});

   router.get(function(req, res) {
       posting.find({ creator: req.body.creator }, function(err, posts) {
        
           res.json(posts);
        });

});
module.exports = router;