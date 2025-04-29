const mongoose= require('mongoose');

const ratingSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyNote' },
    rating: { type: Number,
               max: 5, 
        required: true },
  },
  {timestamps:true});



  module.exports= mongoose.model('Rating', ratingSchema);
