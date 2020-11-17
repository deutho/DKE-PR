const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config')
const routeRoutes =  require('./routes/route');
const mongoose = require('mongoose');


mongoose.connect(config.database, function(err) {
    if(err) {
        console.log('Database connection problem' + err);
    }
    else {
        console.log('Connected to Database');
    }

})
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));



app.listen(config.port, function(err) {
    if(err) {
        console.log(err);
    }
    else{
        console.log("Listening on port 3000");
    }

});

app.use('/route',routeRoutes);