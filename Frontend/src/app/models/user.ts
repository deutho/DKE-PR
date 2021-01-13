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

export class setPasswort {
  public constructor(
    public passwort: string
  ) {}
}

export class setVorname {
  public constructor(
    public vorname: string
  ) {}
}

export class setNachname {
  public constructor(
    public nachname: string
  ) {}
}

export class setEmail {
  public constructor(
    public email: string
  ) {}
}


