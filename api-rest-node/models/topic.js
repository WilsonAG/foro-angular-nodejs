'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// modelo de comment
const CommentSchema = Schema({
	content: String,
	date: {
		type: Date,
		default: Date.now()
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});
const Comment = mongoose.model('Comment', CommentSchema);

// modelo de topic
const TopicSchema = Schema({
	title: String,
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
	comments: [CommentSchema]
});

module.exports = mongoose.model('Topic', TopicSchema);
