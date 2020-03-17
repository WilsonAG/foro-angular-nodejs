export class Comment {
    public _id: string;
    public content: string;
    public date: string;

    constructor(public user: any) {
        this._id = '';
        this.content = '';
        this.date = '';
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
