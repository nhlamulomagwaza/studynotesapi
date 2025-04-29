// GlobalChatController
const GlobalChat = require("../models/globalChatModel.js");
const Message = require("../models/globalMessageModel.js");
const Students = require("../models/studentModel.js");



const getMessages = async (req, res) => {
  try {
    const senderId = req.user.studentId;

    const globalChat = await GlobalChat.findOne({}).populate('messages');

    if (!globalChat) return res.status(200).json([]);

    const messages = globalChat.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user.studentId;

        let globalChat = await GlobalChat.findOne({});

        if (!globalChat) {
            globalChat = await GlobalChat.create({
                participants: [senderId], // Add all registered student IDs here
            });
        }

        // Fetch the sender document from the Students collection
        const sender = await Students.findById(senderId);

        if (!sender) {
            return res.status(404).json({ msg: 'Sender not found' });
        }
        console.log(sender.name)

        // Fetch the receiver document from the Students collection
        // In this example, we assume that the receiverId is already known
        // You can modify this part to fetch the receiver document based on your requirements
        // const receiverId = "receiver_id"; // Replace with the actual receiverId
        // const receiver = await Students.findById(receiverId);

        // If you want all students to see the message in a global room, set receiverId to null
        const receiverId = null;

        const newMessage = new Message({
            senderId,
          //  receiverId,
            senderName: sender.name,
           //  receiverName: receiver.name, // Remove receiverName if receiverId is null
            message,
        });

        if (newMessage) {
            globalChat.messages.push(newMessage._id);
        }

        await Promise.all([globalChat.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports= {getMessages, sendMessage}