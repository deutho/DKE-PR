export class user{
    public constructor(
        // public id: string, 
        public vorname: string, 
        public nachname: string, 
        public email: string,
        public passwort: string,
        public status: string
        ) {}
}

export class loginUser {
    public constructor(
    public email: string,
    public passwort: string
    ){}
}

export class setStatus {
    public constructor(
    public status: string
    ) {}
}