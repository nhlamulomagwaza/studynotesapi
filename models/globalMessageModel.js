const mongoose= require('mongoose');

const globalMessageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Students",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Students",
			required: false,
		},
        senderName: {
            type: String,
            required: true,
        },
        receiverName: {
            type: String,
            required: false,
        },
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("GlobalMessage", globalMessageSchema);

module.exports=Message;