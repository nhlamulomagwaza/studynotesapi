const Comment = require('../models/commentModel');
const Reply= require('../models/replyModel');

const addReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { replyDescription } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = new Reply({
      replyDescription,
      studentId: req.user.studentId, // Assuming req.user is the authenticated user
      studentName: req.user.name,
      studentSurname: req.user.surname,
    }); 
    comment.replies.push(reply); 
    await reply.save();
    await comment.save(); 
  
    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding reply' });
  }
};

const updateReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;
    const { replyDescription } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = comment.replies.find(reply => reply._id.toString() === replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const updatedReply = await Reply.findByIdAndUpdate(replyId, { replyDescription }, { new: true });
    if (!updatedReply) {
      return res.status(500).json({ error: 'Error updating reply' });
    }

    res.status(200).json(updatedReply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating reply' });
  }
};


const getReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = comment.replies.find(reply => reply._id.toString() === replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const fullReply = await Reply.findById(replyId);
    if (!fullReply) {
      return res.status(500).json({ error: 'Error retrieving reply' });
    }

    res.status(200).json(fullReply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving reply' });
  }
};

const getAllReplies = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Fetch the full reply objects using their IDs
    const replyIds = comment.replies;
    const replies = await Reply.find({ _id: { $in: replyIds } });

    res.status(200).json(replies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving replies' });
  }
};
  
const deleteReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
    if (replyIndex === -1) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Remove the reply from the comment's replies array
    comment.replies.splice(replyIndex, 1);
  
    await comment.save();

    // Delete the reply from the Reply model and save it
    const deletedReply = await Reply.findByIdAndDelete(replyId);
    if (!deletedReply) {
      return res.status(500).json({ error: 'Error deleting reply' });
    }

    res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting reply' });
  }
};














module.exports={addReply, updateReply, deleteReply,
   getReply, getAllReplies};