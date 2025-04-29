// replyModel.js
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
  replyDescription: { type: String, required: true },
  studentName: { type: String, required: true },
  studentSurname: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Students'  }],

  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
  nestedReplies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NestedReply' }],
},
{timestamps:true});

module.exports = mongoose.model('Reply', replySchema);