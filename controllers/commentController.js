const Comment = require('../models/commentModel');
const StudyNote = require('../models/studyNoteModel');
const Student = require('../models/studentModel');





// Create a middleware function to update the average rating
async function updateAverageRating(noteId, comments) {
  if (comments.length === 0) {
    await StudyNote.findByIdAndUpdate(noteId, { averageRating: 0 });
  } else {
    const ratings = comments.map(comment => comment.rating);
    const averageRating = ratings.reduce((acc, current) => acc + current, 0) / ratings.length;
    await StudyNote.findByIdAndUpdate(noteId, { averageRating: averageRating }); 
  }
  // Fetch the student associated with the note
  const note = await StudyNote.findById(noteId);
  const student = await Student.findById(note.studentId);

  // Calculate the new credibility based on the average rating of the student's notes
  const notes = await StudyNote.find({ studentId: student._id });
  const ratings = notes.map(note => note.averageRating);
  const credibility = ratings.length > 0 ? ratings.reduce((acc, current) => acc + current, 0) / ratings.length : 0;
  student.credibility = credibility;

  await student.save();
}

const createComment = async (req, res) => {
  const noteId = req.params.noteId;
  const { comment, rating } = req.body;

  if (!noteId || !comment || !rating) {
    return res.status(400).json({ message: 'Note ID, comment, and rating are required' });
  }

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: 'You must be logged in to create a comment' });
  }

  try {
   
    const student = await Student.findById(req.user.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    
    let studentId= req.user.studentId;
    student.commentCount= (await Comment.countDocuments({studentId}))+1;

    await student.save();

    const newComment = new Comment({
      studentId: req.user.studentId,
      studentName: student.name,
      studentSurname: student.surname,
      noteId,
      comment: comment,
      rating: rating,
    });

    await newComment.save();

    // Fetch the study note from the database
    const studyNote = await StudyNote.findById(noteId);

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    // Push the new comment into the comment array of the study note
    studyNote.comments.push(newComment);
    await studyNote.save();
    const comments = await Comment.find({ noteId });
    
    await updateAverageRating(noteId, comments);

    res.status(201).json({ newComment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment: ' + error.message });
  }
};

const getComment = async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const comments = await Comment.find({ noteId }).select('comment rating').populate({
      path: 'studentId',
      model: 'Student'
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments: ' + error.message });
  }
};

const updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const noteId = req.params.noteId;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: 'Comment and rating are required' });
  }

  try {
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the authenticated student is the owner of the comment
    if (existingComment.studentId._id.toString() !== req.user.studentId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }
    const comments = await Comment.find({ noteId });
    
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { comment, rating }, { new: true });
    await updateAverageRating(noteId, comments);

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment: ' + error.message });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const noteId = req.params.noteId;

  try {
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the authenticated student is the owner of the comment
    if (existingComment.studentId._id.toString() !== req.user.studentId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    // Fetch the student information from the database
    let studentId = req.user.studentId;
    const student = await Student.findById(req.user.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Decrement the comment count of the student
    student.commentCount = (await Comment.countDocuments({ studentId })) - 1;
    await student.save();

    // Remove the comment from the comments array of the study note
    const studyNote = await StudyNote.findByIdAndUpdate(noteId, { $pull: { comments: commentId } }, { new: true });

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    await Comment.findByIdAndDelete(commentId);

    // Fetch the remaining comments
    const remainingComments = await Comment.find({ noteId });

    // Update the average rating
    await updateAverageRating(noteId, remainingComments);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment: ' + error.message });
  }
};




module.exports = { createComment, getComment, updateComment, deleteComment };