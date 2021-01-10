var User = require('../model/User');
var Post = require('../model/Posting')

module.exports = function(app, express)
{

    var router = express.Router();


    router.post('/login', function(req, res){
        var user = new User({
            id: req.body.id,
            name: req.body.name,
            password: req.body.password,
        });

        user.save(function(err){
            if(err){
                res.send(err);
                return;
            }

            res.json({message: 'User has been created'});
        });
    });

    router.get('/users', function(req, res){

        User.find({},function(err,users){
            if(err){
                res.send(err);
                return;
            }
            
            res.json(users);
        });
    });


    router.post("/create", function(req, res){
        console.log(req.body.creator)
        var posting = new Post({
            creator: req.body.creator,
            emotion: req.body.emotion,
            content: req.body.content,
            hashtags: req.body.hashtags

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

            res.json(postings);
       });
    });


    /*router.put('/:id', async(req, res) =>{
        Post.findByIdAndUpdate(req.params.id , {useFindandModify: flase})

        res.send(post);

    });*/
    
    router.delete('/id', async (req, res) =>{
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/');
        res.json({message: "Post deleted"});
    });

    return router;
}
