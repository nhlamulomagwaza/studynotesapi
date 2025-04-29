const express= require('express');
const router= express.Router();
const {addNestedReply, updateNestedReply, deleteNestedReply, getAllNestedReplies}= require('../controllers/nestedRepliesController');





router.get('/getallnestedreplies', getAllNestedReplies);
router.post('/addnestedreply/:commentId/:replyId', addNestedReply);
router.put('/updatenestedreply/:nestedReplyId', updateNestedReply);
router.delete('/deletenestedreply/:nestedReplyId', deleteNestedReply);



module.exports= router;