const mongoose= require('mongoose');
const Comment = require('./commentModel');
const Note= require('../models/studyNoteModel');


const studentSchema= new mongoose.Schema({


        name:{

            type: String,
            required: true,
        },
        surname:{

            type:String,
            required:true,
        },
        gender:{
            type:String,
            required:true,
            enum: ['male', 'female']
        },
        major:{
          type: String,
          required: true,
          enum: ['business', 'medicine', 'science', 'social sciences and history',
            'engineering', 'biological and biomedical sciences', 
            'psychology', 'communication and journalism',
             'visual and performing arts', 'education',
              'computer and information sciences']
        },

        collegeName:{
            type: String,
            required: true,
        },
        city:{
            type: String,
            required: true,
        },

        about:{

          type:String,
          required:true,
        },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        profilePic: {
          type: "String",
          required: false,
          default:
            `https://avatar.iran.liara.run/public/`,
        },
        isAdmin: {
          type: Boolean,
          required: false,
          default: false,
        },

        
        noteCount: {
          type: Number,
          required: true,
          default: 0,


        },

        commentCount: {
          type: Number,
          required: true,
          default: 0,
        
        },


        credibility: {
          type: Number,
          required: true,
          default: 0,
      
        },
      }, { timestamps: true });
      
     
      
      
      
      module.exports = mongoose.model('Students', studentSchema);