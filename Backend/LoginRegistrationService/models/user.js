const db = require('../util/database');

module.exports = class User{
    constructor(vorname, nachname, email, passwort, status) {
        this.vorname = vorname;
        this.nachname = nachname;
        this.email = email;
        this.passwort = passwort;
        this.status = status;
    }

    static find(email){
       return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static save(user){
       return db.execute(
            'INSERT INTO users (vorname, nachname, email, passwort, status) VALUES ( ?,?,?,?,?)',
            [user.vorname, user.nachname, user.email, user.passwort, user.status]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM users WHERE id = ?', [id]);
    }

    
    static getUserData(id) {
        return db.execute('SELECT id, vorname, nachname, email, status FROM users WHERE id = ?', [id]);
    }
};

