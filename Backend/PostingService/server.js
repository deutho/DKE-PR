const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config')
const mongoose = require('mongoose');
const { eventNames } = require('../LoginRegistrationService/util/database');

//Connection to database
mongoose.connect(config.database, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});


var db = mongoose.connection;


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

var router = require('./routes/router')(app, express);
app.use('/router',router);


db.on("error", console.error.bind(console, "connection error:"));
db.once("open", _ => {
  console.log("Connected to DB");
});

app.listen(config.port, function(err) {
    if(err) {
        console.log(err);
    }
    else{
        console.log("Listening on port 5000");
    }

});

