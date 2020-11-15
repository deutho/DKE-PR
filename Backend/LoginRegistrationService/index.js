const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

const morgan = require('morgan');

const errorController = require('./controller/error');

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) =>{
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
});

app.use('/auth', authRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.use(morgan('dev'));

app.listen(ports, () => console.log(`Listening on port ${ports}`));
