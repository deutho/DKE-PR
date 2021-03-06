var User = require('../model/User');
var Post = require('../model/Posting')
const amqp = require('amqplib/callback_api');
var config = require('./../config')
const mongoose = require('mongoose');


module.exports = function(app, express)
{

    var router = express.Router();


    amqp.connect(config.messagebroker,function(err, connection){
        if(err){
            console.log("cannot connect to message broker")
            throw err;
        }
    
        connection.createChannel(function(errCh, channel){
            if(errCh){
                throw errCh;
            }
    
            var qeue = 'postings';
    
            channel.assertQueue(qeue, {
            durable: false
            });
       
        channel.consume(qeue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            const qm = JSON.parse(msg.content.toString());
            
            
            // console.log(posting);
            // var testJson = JSON.parse(qm) 
            // console.log(testJson.creator);

            var posting = new Post({
                creator: qm.creator,
                emotion: qm.emotion,
                content: qm.content,
                hashtags: qm.hashtags,
                name: qm.name
            });
            console.log(posting);
            posting.save(function(err){
                if(err){
                    console.log(err)
                    return;
                }   
            });
            // var db = mongoose.connection;
            // db.connection.save(qm)

          }, {
              noAck: true
            });
    
       
        });
    });

    

    router.post("/create", function(req, res){
        console.log(req.body.creator)
        var posting = new Post({
            creator: req.body.creator,
            emotion: req.body.emotion,
            content: req.body.content,
            hashtags: req.body.hashtags,
            name: req.body.name
        });

        posting.save(function(err){
            if(err){
                res.send(err);
                return;
            }

            res.json({message: "New Post Created"});
        });

    })

    router.get("/:id", function(req, res){
        console.log(req.params.id)
        Post.find({creator: req.params.id}, function(err, postings){            
            if(err) {                
                res.send(err);
                return;
            }

            res.json({postings: postings});
       });
    });


    router.put('/:id', async(req, res) =>{
        Post.findByIdAndUpdate(req.params.id , {useFindandModify: flase})

        res.send(post);

    });
    
    router.delete('/id', async (req, res) =>{
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/');
        res.json({message: "Post deleted"});
    });


 

    return router;
}
