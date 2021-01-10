const express = require('express');

const {body} = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controller/auth');

const auth = require('../middleware/auth');

router.post(
    '/register',
    [

        body('vorname').trim().isLength({min: 1}),
       body('nachname').trim().isLength({min: 1}),
       body('email').isEmail().withMessage('Bitte gültige Email eingeben')
            .custom(async (email) => {
                const user = await User.find(email);
                if (user[0].length > 0) {
                    return Promise.reject('Email-Adresse existiert schon!');
                }
            })
            .normalizeEmail(),
        body('passwort').trim().isLength({min: 8}),
        //body('geburtstag').isDate().withMessage('Bitte gültiges Datum eingeben'),

    ],
    authController.register
);

router.post('/login', authController.login);

router.delete('/delete/:id', authController.delete);

router.get('/user/:id', authController.getUserData);

router.put('/setVorname/:id', authController.setVorname);

router.put('/setNachname/:id', authController.setNachname);

router.put('/setEmail/:id', authController.setEmail);

router.put('/setPasswort/:id', authController.setPasswort);

router.put('/setStatus/:id', authController.setStatus);

module.exports = router;
