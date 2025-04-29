const mongoose= require('mongoose');
const Comment= require('./commentModel');
const Student = require('./studentModel');



const noteSchema= new mongoose.Schema({

      title:{

        type: String,
        required:true,
      },
      description:{
         
        type: String,
        required:true,
      },

      noteBanner:{

        type:String,
        required:false,
        default:'https://picsum.photos/500/300'
      },

      relatedMajor:{
         
        type: String,
        enum: ['business', 'medicine', 'science', 'social sciences and history',
             'engineering', 'biological and biomedical sciences', 
             'psychology', 'communication and journalism',
              'visual and performing arts', 'education',
               'computer and information sciences']
      },

       collegeName:{

        type: String,
        required:true,},

        author:{

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Students',
             required:true,
        },
        authorName: {
          type: String,
        },
        authorSurname: {
          type: String,
        }
        ,
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Students',
          required: true,
        },
        comments: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment',
        }],
        averageRating: {
          type: Number,
          default: 0,
        },
      

}, {timestamps: true});







module.exports= mongoose.model("StudyNotes", noteSchema);


