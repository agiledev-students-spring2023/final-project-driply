const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority');

const CommentSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;