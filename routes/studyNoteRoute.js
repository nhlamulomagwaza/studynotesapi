const express= require('express');
const router= express.Router();
const {getAllStudyNotes, getAllStudyNotesOfAStudent,
    createStudyNote, updateStudyNote,
    deleteStudyNote} = require('../controllers/studyNoteController');
    const authenticateStudent= require('../auth/authenticateStudent');

    const multer = require('multer');
    const upload = multer({ dest: './uploads/' });

    router.get('/', getAllStudyNotes);
    router.get('/:studentId',authenticateStudent, getAllStudyNotesOfAStudent);
    router.post('/createstudynote/:studentId', authenticateStudent, upload.single('noteBanner'),  createStudyNote);
    router.put('/updatestudynote/:id',authenticateStudent, upload.single('noteBanner'), updateStudyNote);
    router.delete('/deletestudynote/:id',authenticateStudent, deleteStudyNote);


    module.exports= router;