const Reply = require('../models/replyModel');
const NestedReply= require('../models/nestedReplyModel');
const addReplyLike = async (req, res) => {
  try {
    const replyId = req.params.replyId;
    const studentId = req.user.studentId;

    // Check if the student has already liked the reply
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    console.log(reply)

    if (reply.likes.includes(studentId)) {
      return res.status(400).json({ message: 'Student has already liked this reply' });
    }

    // Add the studentId to the likes array
    reply.likes.push(studentId);
    await reply.save();

    res.status(200).json({ message: 'Reply liked successfully', likes: reply.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error)
  }
};



const removeReplyLike = async (req, res) => {
  try {
    const replyId = req.params.replyId;
    const studentId = req.user.studentId;

    // Check if the student has already liked the reply
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if the student has already liked the reply
    if (!reply.likes.includes(studentId)) {
      return res.status(400).json({ message: 'Student has not liked this reply' });
    }

    // Remove the studentId from the likes array
    await Reply.findByIdAndUpdate(replyId, { $pull: { likes: studentId } });

    res.status(200).json({ message: 'Reply like removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};



//NESTED REPLIES

const addNestedReplyLike = async (req, res) => {
  try {
    const nestedReplyId = req.params.nestedReplyId;
    const studentId = req.user.studentId;

    // Check if the student has already liked the nested reply
    const nestedReply = await NestedReply.findById(nestedReplyId);
    if (!nestedReply) {
      return res.status(404).json({ message: 'Nested reply not found' });
    }

    if (nestedReply.likes.includes(studentId)) {
      return res.status(400).json({ message: 'Student has already liked this nested reply' });
    }

    // Add the studentId to the likes array
    nestedReply.likes.push(studentId);
    await nestedReply.save();

    res.status(200).json({ message: 'Nested reply liked successfully', likes: nestedReply.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};


const removeNestedReplyLike = async (req, res) => {
  try {
    const nestedReplyId = req.params.nestedReplyId;
    const studentId = req.user.studentId;

    // Check if the student has already liked the nested reply
    const nestedReply = await NestedReply.findById(nestedReplyId);
    if (!nestedReply) {
      return res.status(404).json({ message: 'Nested reply not found' });
    }

    // Check if the student has already liked the nested reply
    if (!nestedReply.likes.includes(studentId)) {
      return res.status(400).json({ message: 'Student has not liked this nested reply' });
    }

    // Remove the studentId from the likes array
    await NestedReply.findByIdAndUpdate(nestedReplyId, { $pull: { likes: studentId } });

    res.status(200).json({ message: 'Nested reply like removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};




module.exports = {addReplyLike, removeReplyLike, addNestedReplyLike, removeNestedReplyLike};