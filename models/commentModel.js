const mongoose = require('mongoose');
const Reply= require('./replyModel');






const commentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyNote' },

  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  studentName: { type: String, required:true, },
  studentSurname: { type: String, required:true, },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],

  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
,
},
{timestamps:true});

commentSchema.pre('find', function() {
  this.populate('studentId', 'name surname');
});

commentSchema.pre('findOne', function() {
  this.populate('studentId', 'name surname');
});









module.exports = mongoose.model('Comment', commentSchema);