const {addCommentLike, removeCommentLike}= require('../controllers/commentLikesController');

const express= require('express');
const router= express.Router();



router.post('/addcommentlike/:noteId/:commentId', addCommentLike);
router.delete('/removecommentlike/:noteId/:commentId', removeCommentLike);


module.exports=router;