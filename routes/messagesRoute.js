const express= require('express');
const { getMessages, sendMessage }= require("../controllers/messagesController.js");


const router = express.Router();

router.get("/getmessages/:id", getMessages);
router.post("/sendmessage/:id", sendMessage);

module.exports= router;