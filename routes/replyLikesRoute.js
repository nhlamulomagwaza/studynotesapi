const express= require('express');
const router= express.Router();


const {addReplyLike, removeReplyLike, addNestedReplyLike,
    removeNestedReplyLike
}= require('../controllers/replyLikesController');

router.post('/addreplylike/:replyId/', addReplyLike);
router.delete('/removereplylike/:replyId', removeReplyLike);
router.post('/addnestedreplylike/:nestedReplyId', addNestedReplyLike);
router.delete('/removenestedreplylike/:nestedReplyId', removeNestedReplyLike);


module.exports= router;