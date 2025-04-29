const mongoose= require('mongoose');



const nestedReplySchema= new mongoose.Schema({


    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
    replyDescription: { type: String, required: true },
    studentName: { type: String, required: true },
    studentSurname: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Students' }],

  
  },
  {timestamps:true});
  
  



module.exports = mongoose.model('NestedReply', nestedReplySchema);
