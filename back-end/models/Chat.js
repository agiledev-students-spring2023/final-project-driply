const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const { json } = require("express");
dotenv.config();

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority');

const MessageSchema = new mongoose.Schema({
    id_from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name_from: {
        type: String,
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
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: {
        type: [MessageSchema],
        default: []
    }
}, {timestamps: true});

ChatSchema.statics.createroom = async function(chatId, members) {
    // validation
    if (!chatId) {
        throw new Error("Can't create chat room. Missing chat id");
    }
    if (!members) {
        throw new Error('Missing members ids to create chat room');
    }

    const chatroom = await this.create({ chatId, members });

    return chatroom;
}

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;