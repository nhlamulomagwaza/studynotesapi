const express= require('express');
const router= express.Router();

const {addReply, updateReply, deleteReply, getReply, getAllReplies,
   
 }
 = require('../controllers/repliesController');



 router.post('/addreply/:commentId', addReply);
 router.put('/updatereply/:commentId/:replyId', updateReply);
 router.get('/getreply/:commentId/:replyId', getReply);
 router.get('/getreply/:commentId', getAllReplies);
 router.delete('/deletereply/:commentId/:replyId', deleteReply);

//NESTED REPLIES

 


 module.exports= router;