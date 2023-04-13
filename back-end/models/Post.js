const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URI);

const PostSchema = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  image: String, //tbd
  description: String,
  price: Number,
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

});

mongoose.model('Post', PostSchema);