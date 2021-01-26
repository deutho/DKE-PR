// export class createPerson{
//     public constructor(
//         public id: string, 
//         public name: string, 
//         ) {}
// }

// declare module createPerson {

//     export interface CreatePerson {
//         id: string;
//         name: string;
//     }

//     export interface RootObject {
//         createPerson: CreatePerson[];
//     }

// }

export class createPerson{
    public constructor(
        public id: string, 
        public name: string, 
        ) {}
}

export class rootCreatePerson {
    public constructor(
        public createPerson: createPerson[]
    ) {}
}


export class following{
    public constructor(
        public id: string, 
        public name: string, 
        ) {}
}

export class responseGetPerson{
    public constructor(
        public id_person: string, 
        public name: string, 
        public followPersons: string[]
        ) {}
}



