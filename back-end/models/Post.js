const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority');

const PostSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  image: String, //tbd
  description: String,
  price: Number,
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post