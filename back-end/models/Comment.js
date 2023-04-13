const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URI);

const CommentSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('Comment', CommentSchema);