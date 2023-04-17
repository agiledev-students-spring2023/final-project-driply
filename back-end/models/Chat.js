const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const { json } = require("express");
dotenv.config();

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority');

const MessageSchema = new mongoose.Schema({
    id_from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name_from: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
}, {timestamps: true});

const Chat = mongoose.model("Chat", ChatSchema);

ChatSchema.statics.createChatRoom = async function(chatId) {
    // validation
    if (!chatId) {
        throw new Error("Can't create chat room. Missing chat id");
    }

    const chatroom = await this.create({ chatId });

    return chatroom;
}

module.exports = Chat;