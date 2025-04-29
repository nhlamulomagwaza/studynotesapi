const express= require('express');
const { getMessages, sendMessage }= require("../controllers/globalChatController");


const router = express.Router();

router.get("/getmessages/", getMessages);
router.post("/sendmessage/", sendMessage);

module.exports= router;