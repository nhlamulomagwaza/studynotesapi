const {createComment,
     getComment,
     updateComment,
      deleteComment}= require('../controllers/commentController');

const express= require('express');
const router= express.Router();




router.get('/:noteId', getComment);
router.post('/createcomment/:noteId', createComment);
router.put('/updatecomment/:noteId/:commentId', updateComment);
router.delete('/deletecomment/:noteId/:commentId', deleteComment);



module.exports= router;