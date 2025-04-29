const Comment = require('../models/commentModel');
const Reply = require('../models/replyModel');
const NestedReply = require('../models/nestedReplyModel'); // Import the NestedReply model
const mongoose= require('mongoose')
const addNestedReply = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const replyId = req.params.replyId; // The ID of the parent reply
    const { replyDescription } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const parentReply = await Reply.findById(replyId);
    if (!parentReply) {
      return res.status(404).json({ error: 'Parent reply not found' });
    }

    const nestedReply = new NestedReply({ // Create a new instance of NestedReply
      replyDescription,
      studentId: req.user.studentId,
      studentName: req.user.name,
      studentSurname: req.user.surname,
      likes: []
    });

    // Save the nested reply in the database
    await nestedReply.save();

    // Push the _id of the nested reply into the parentReply's nestedReplies array
    parentReply.nestedReplies.push(nestedReply._id);
    await parentReply.save();

    res.status(201).json(nestedReply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding nested reply' });
  }
};

const updateNestedReply = async (req, res) => {
  try {
    const nestedReplyId = req.params.nestedReplyId;
    const { replyDescription } = req.body;

    const nestedReply = await NestedReply.findById(nestedReplyId);
    if (!nestedReply) {
      return res.status(404).json({ error: 'Nested reply not found' });
    }
   
    // Check if the user is authorized to update the nested reply
    // You can add your own authorization logic here
    if (nestedReply.studentId.toString() !== req.user.studentId) {
      return res.status(403).json({ error: 'Unauthorized to update this nested reply' });
    }
     
    // Update the nested reply's replyDescription
    nestedReply.replyDescription = replyDescription;
    await nestedReply.save();

    res.status(200).json(nestedReply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating nested reply' });
  }
};

const deleteNestedReply = async (req, res) => {
  try {
    const nestedReplyId = req.params.nestedReplyId;

    const nestedReply = await NestedReply.findById(nestedReplyId);
    if (!nestedReply) {
      return res.status(404).json({ error: 'Nested reply not found' });
    }

    // Check if the user is authorized to delete the nested reply
    // You can add your own authorization logic here
    if (nestedReply.studentId.toString() !== req.user.studentId) {
      return res.status(403).json({ error: 'Unauthorized to delete this nested reply' });
    }

    // Find the parent reply of the nested reply
    const parentReply = await Reply.findOne({ nestedReplies: nestedReplyId });
    if (parentReply) {
      // Remove the nested reply ID from the parent reply's nestedReplies array
      parentReply.nestedReplies = parentReply.nestedReplies.filter(
        (replyId) => replyId.toString() !== nestedReplyId
      );
      await parentReply.save();
    }

    // Remove the nested reply from the database
    await nestedReply.deleteOne();

    res.status(200).json('nested reply deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting nested reply' });
  }
};

const getAllNestedReplies = async (req, res) => {
  try {
    // Fetch all nested replies from the database
    const nestedReplies = await NestedReply.find();

    res.status(200).json(nestedReplies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching nested replies' });
  }
};


module.exports = {addNestedReply, updateNestedReply, deleteNestedReply, getAllNestedReplies};