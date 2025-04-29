const Comment = require('../models/commentModel');
const StudyNote = require('../models/studyNoteModel');
const Student = require('../models/studentModel');

const addCommentLike = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const noteId = req.params.noteId;
    const commentId = req.params.commentId;

    const studyNote = await StudyNote.findById(noteId);
    if (!studyNote) {
      return res.status(404).json({ error: 'Study note not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (comment.likes && comment.likes.some(like => like.equals(studentId))) {
      return res.status(400).json({ error: 'You have already liked this comment' });
    }

    if (comment.likes) {
      comment.likes.push(studentId);
      await comment.save();
    } else {
      comment.likes = [studentId];
      await comment.save();
    }

    res.json({ message: 'like added successfully', likes: comment.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding likes' });
  }
};

const removeCommentLike = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const noteId = req.params.noteId;
    const commentId = req.params.commentId;

    const studyNote = await StudyNote.findById(noteId);
    if (!studyNote) {
      return res.status(404).json({ error: 'Study note not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const likeIndex = comment.likes.findIndex(like => like.equals(studentId));
    if (likeIndex !== -1) {
      comment.likes.splice(likeIndex, 1);
      await comment.save();
      res.json({ message: 'Like removed successfully', likes: comment.likes.length });
    } else {
      return res.status(400).json({ error: 'You have not liked this comment' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing like' });
  }
};

module.exports = { addCommentLike, removeCommentLike };