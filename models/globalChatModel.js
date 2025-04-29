// GlobalChat model
const mongoose = require('mongoose');

const globalChatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Students",
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "GlobalMessage",
            },
        ],
        senderName: {
            type: String,
            required: false,
        },
        receiverName: {
            type: String,
            required: false,
        },
        // createdAt, updatedAt
    },
    { timestamps: true }
);

const GlobalChat = mongoose.model("GlobalChat", globalChatSchema);

module.exports = GlobalChat;