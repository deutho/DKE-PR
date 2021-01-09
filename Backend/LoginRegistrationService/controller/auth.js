const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) return;

    const vorname = req.body.vorname;
    const nachname = req.body.nachname;
    const email = req.body.email;
    const passwort = req.body.passwort;
    const geburtstag = req.body.geburtstag;

    try
    {
        const hashedPasswort = await bcrypt.hash(passwort, 12);
        const userDetails = {
            vorname: vorname,
            nachname: nachname,
            email: email,
            passwort: hashedPasswort,
            geburtstag: geburtstag,
        };



        const result = await User.save(userDetails);

        res.status(201).json({ message: 'Benutzer registriert!'});

    }
    catch (err)
    {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
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
