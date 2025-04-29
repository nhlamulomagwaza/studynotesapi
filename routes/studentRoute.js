const express= require('express');
const router= express.Router();
const {registerStudent, loginStudent, getAllStudents, updateStudent, deleteStudent, logoutStudent}= require('../controllers/studentController');
const authenticateStudent = require('../auth/authenticateStudent');



router.post('/auth/register', registerStudent);

router.post('/auth/login', loginStudent);
router.post('/auth/logout/:studentId', authenticateStudent, logoutStudent);
router.get('/', getAllStudents);
router.put('/updatestudent/:studentId', authenticateStudent,   updateStudent);
router.delete('/deletestudent/:studentId', authenticateStudent,   deleteStudent);


module.exports= router;