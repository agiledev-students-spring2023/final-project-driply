const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/?retryWrites=true&w=majority');


const UserSchema = new mongoose.Schema({
	name: String,
	password: String, //tbd
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  bookmark: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]

  
});

const PostSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  image: String, //tbd
  description: String,
  price: Number,
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

});

const CommentSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

mongoose.model('User', UserSchema);

mongoose.model('Post', PostSchema);

mongoose.model('Comment', CommentSchema);