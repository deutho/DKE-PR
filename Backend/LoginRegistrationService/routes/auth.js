const express = require('express');

const {body} = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controller/auth');

router.post(
    '/register',
    [
        body('vorname').trim().not().isEmpty,
        body('nachname').trim().not().isEmpty,
        body('email').isEmail().withMessage('Bitte gültige Email eingeben')
            .custom(async (email) => {
                const user = await User.find(email);
                if (user[0].length > 0) {
                    return Promise.reject('Email-Adresse existiert schon!');
                }
            })
            .normalizeEmail(),
        body('passwort').trim().isLength({min: 8}),
        body('geburtstrag').isDate().withMessage('Bitte gültiges Datum eingeben'),

    ],
    authController.register
);

module.exports = router;