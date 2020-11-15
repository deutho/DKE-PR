const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

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
