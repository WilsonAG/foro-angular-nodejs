export class Comment {
    public _id: string;
    public content: string;
    public date: string;
    public user: any;

    constructor() {
        this._id = '';
        this.content = '';
        this.date = '';
        this.user = '';
    }
}

/* content: String,
	date: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	} */
