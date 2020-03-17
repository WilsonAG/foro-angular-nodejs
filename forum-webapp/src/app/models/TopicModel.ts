import { User } from './UserModel';
import { Comment } from './CommentModel';

export class Topic {
    public _id: string;
    public title: string;
    public content: string;
    public code: string;
    public lang: string;
    public date: string;
    public comments: Array<Comment>;

    constructor(public user: any) {
        this._id = '';
        this.title = '';
        this.content = '';
        this.code = '';
        this.lang = '';
        this.date = '';
        this.comments = null;
    }
}

/* 	title: String,
	content: String,
	code: String,
	lang: String,
	date: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [CommentSchema] */
