const StudyNotes= require('../models/studyNoteModel');
const Students= require('../models/studentModel');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;


 cloudinary.config({
  cloud_name: 'dofj0x1ml',
  api_key: '299521161191728',
  api_secret: process.env.CLOUDINARY_SECRET,
}); 

const getAllStudyNotes = async (req, res) => {
    try {
      const studyNotes = await StudyNotes.find();
      res.status(200).json(studyNotes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Get all study notes for a specific student
const getAllStudyNotesOfAStudent = async (req, res) => {
    try {
      const studentId = req.params.studentId; // Assuming the studentId is passed as a parameter in the request
      const studyNotes = await Students.find({ student: studentId });
      res.status(200).json(studyNotes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  const createStudyNote = async (req, res) => {
    try {
      const studentId = req.user.studentId;
      const student = await Students.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Upload the noteBanner image using multer
      
  
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
  
        // Remove the uploaded file from the server
        fs.unlinkSync(req.file.path);
  
        const newStudyNote = new StudyNotes({
          // ...
          noteBanner: result.secure_url,
          // ...
          author: studentId,
          studentId: studentId,
          authorName: req.user.name,
          authorSurname: req.user.surname,
          collegeName: req.body.collegeName,
          description: req.body.description,
          title: req.body.title,
        });
  
        const savedStudyNote = await newStudyNote.save();
  
        student.noteCount = (await StudyNotes.countDocuments({ studentId }));
        await student.save();
  
        res.status(201).json(savedStudyNote);
   
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };




  // Update a study note
// Update a study note
const updateStudyNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const userId = req.user.studentId; // Assuming the user ID is passed in the request

    // Fetch the study note from the database
    const studyNote = await StudyNotes.findById(noteId);

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    // Check if the user is the owner of the study note
    if (studyNote.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this study note' });
    }

    // Upload the noteBanner image using multer
    if (req.file) {
      // If a new noteBanner image is uploaded, delete the old one from Cloudinary
      const publicId = studyNote.noteBanner.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Remove the uploaded file from the server
      fs.unlinkSync(req.file.path);

      // Update the noteBanner field in the request body
      req.body.noteBanner = result.secure_url;
    }

    // Update the study note
    const updatedStudyNote = await StudyNotes.findByIdAndUpdate(noteId, req.body, { new: true });
    res.status(200).json(updatedStudyNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a study note
const deleteStudyNote = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const userId = req.user.studentId; // Assuming the user ID is passed in the request

    // Fetch the study note from the database
    const studyNote = await StudyNotes.findById(noteId);

    if (!studyNote) {
      return res.status(404).json({ message: 'Study note not found' });
    }

    // Check if the user is the owner of the study note
    if (studyNote.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this study note' });
    }

    // Fetch the student from the database
    const student = await Students.findById(userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

   
    student.noteCount = (await StudyNotes.countDocuments({ userId }));
    await student.save();

    // Delete the study note
    const deletedStudyNote = await StudyNotes.findByIdAndDelete(noteId);
    
     
    res.status(200).json({ message: 'Study note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  module.exports= {
getAllStudyNotes, getAllStudyNotesOfAStudent,
createStudyNote, updateStudyNote,
deleteStudyNote
  }