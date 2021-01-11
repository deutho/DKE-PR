export class posting{
    public constructor(
        public creator: String,
        public emotion: String,
        public content: String, 
        public hashtags: String[],
        public name: String,
        public created: Date
    ){}
}