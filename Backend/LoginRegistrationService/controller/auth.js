const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res, next) => {
    
    const errors = validationResult(req);
    try
    {
    const vorname = req.body.vorname;
    const nachname = req.body.nachname;
    const email = req.body.email;
    const passwort = req.body.passwort;
    const status = req.body.status;


        const hashedPasswort = await bcrypt.hash(passwort, 12);
        const userDetails = {
            vorname: vorname,
            nachname: nachname,
            email: email,
            passwort: hashedPasswort,
            status: status,
        };



        const result = await User.save(userDetails);

        res.status(201).json({ message: 'Benutzer registriert!'});
        // res.status(201).json("{}");

    }
    catch (err)
    {
        // console.log(err)
        // if(!err.statusCode){
            
        //     err.statusCode = 500;
        // }
        // next(err);
        console.log(err.message)
        res.status(205).json("{}");
    }

};


exports.login = async (req, res, next) => {
    const email= req.body.email;
    const passwort = req.body.passwort;

    try{
        const user = await User.find(email);

        if(user[0].length !== 1)
        {
            const error = new Error('User mit dieser Email nicht gefunden!');
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user[0][0];

        const isEqual = await bcrypt.compare(passwort, storedUser.passwort);

        if(!isEqual)
        {
            const error = new Error('Falsches Passwort!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: storedUser.email,
                userId: storedUser.id
            },
            'secretfortoken',
            {expiresIn: '1h'}
        );
        res.status(200).json({token : token, userId: storedUser.id});
    }

    catch (err)
    {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }


};

exports.delete = async (req, res, next) => {
    try
    {        
        const deleteResponse = await User.delete(req.params.id);
        res.status(200).json(deleteResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUserData = async (req, res, next) => {
    try
    {        
        const getUserDataResponse = await User.getUserData(req.params.id);
        res.status(200).json(getUserDataResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.setVorname = async (req, res, next) => {
    try
    {
        const setVornameResponse = await User.setVorname(req.body.vorname,req.params.id);
        res.status(200).json(setVornameResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.setNachname = async (req, res, next) => {
    try
    {
        const setNachnameResponse = await User.setNachname(req.body.nachname,req.params.id);
        res.status(200).json(setNachnameResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.setEmail = async (req, res, next) => {
    try
    {
        const setEmailResponse = await User.setEmail(req.body.email,req.params.id);
        res.status(200).json(setEmailResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.setPasswort = async (req, res, next) => {
    try
    {
        const hashedPasswort = await bcrypt.hash(req.body.passwort, 12);
        const setPasswortResponse = await User.setPasswort(hashedPasswort,req.params.id);
        res.status(200).json(setPasswortResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.setStatus = async (req, res, next) => {
    try
    {
        const setStatusResponse = await User.setStatus(req.body.status,req.params.id);
        res.status(200).json(setStatusResponse);
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
