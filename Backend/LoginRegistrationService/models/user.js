const db = require('../util/database');

module.exports = class User{
    constructor(vorname, nachname, email, passwort, geburtstag) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
        this.geburtstag = geburtstag;
    }

    static find(email){
       return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static save(user){
       return db.execute(
            'INSERT INTO users (vorname, nachname, email, passwort, geburtstag) VALUES ( ?,?,?,?,?)',
            [user.vorname, user.nachname, user.email, user.passwort, user.geburtstag]
        );
    }
};

