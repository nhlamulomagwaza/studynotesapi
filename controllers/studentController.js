const  Students= require('../models/studentModel');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');


const registerStudent = async (req, res) => {
  try {
    const { name, surname, gender, major, collegeName, city, profilePic, email, password, about } = req.body;
  let profileUrl;
    if (!name || !surname || !gender || !major || !collegeName || !city || !email || !password || !about) {
      return res.status(400).json({ msg: 'Please fill in all the fields' });
    }

    const studentExists = await Students.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ msg: 'Student with that email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (gender === 'male') {
      profileUrl = `https://avatar.iran.liara.run/public/boy`;
    } else if (gender === 'female') {
      profileUrl = `https://avatar.iran.liara.run/public/girl`;
    } else {
      return res.status(400).json({ msg: 'Invalid gender. Gender can only be male or female.' });
    }
    
    const student = await Students.create({
      name,
      surname,
      gender,
      major,
      collegeName,
      city,
      profilePic: profileUrl,
      email,
      password: hashedPassword,
      about,
      rating: 0, // Initialize rating to 0
      credibility: 0, // Initialize credibility to 0
      noteCount: 0, // Initialize noteCount to 0
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      surname: student.surname,
      major: student.major,
      collegeName: student.collegeName,
      city: student.city,
      profilePic: student.profilePic,
      NumberOfNotes: student.noteCount,
      about: student.about,
      email: student.email,
      password: password,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const generateAccessToken = (student) => {
  return jwt.sign({ studentId: student._id, name: student.name, surname: student.surname }, process.env.JWT_SECRET);
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please fill in all the fields' });
  }

  

  const student = await Students.findOne({ email });
  const token= generateAccessToken(student);
 
  if (!student) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }
 

  const isMatch = await bcrypt.compare(password, student.password);
   console.log(isMatch)
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid Password' });
  }
  res.cookie('access_token', token, { httpOnly: true }); // 2 minutes

  res.status(200).json({
    _id: student._id,
    name: student.name,
    surname: student.surname,
    major: student.major,
    collegeName: student.collegeName,
    city: student.city,
    profilePic: student.profilePic,
    NumberOfNotes: student.noteCount,
    about: student.about,
    email: student.email,
    password:password,
    token: token
  });
  
};
const logoutStudent = async (req, res) => {
  const { studentId } = req.params;

  // Get the authenticated student from the request
  const authenticatedStudent = req.user;
 
  if (!authenticatedStudent) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (authenticatedStudent.studentId.toString() !== studentId) {
    return res.status(403).json({ msg: 'You are not the owner of this profile' });
  }

  // Invalidate the JWT token
  // You can store the JWT tokens in a database and invalidate them when the user logs out
  // Or you can use a library like jsonwebtoken to invalidate the token

  // For simplicity, let's just remove the token from the request
  delete req.user;
  res.clearCookie('access_token');
  res.status(200).json({ msg: 'Logged out successfully' });
}
const getAllStudents= async(req, res)=>{

try{
 const students= await Students.find();

 res.status(200).json(students)
}catch(err){

res.status(500).json({message: err.message})


}


}





const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { about, collegeName, major, profilePic } = req.body;

  // Get the authenticated student from the request
  const authenticatedStudent = req.user;
  console.log('studentId:', studentId);
  console.log('authenticatedStudent:', authenticatedStudent);
  console.log('authenticatedStudent._id:', authenticatedStudent._id);

  if (!authenticatedStudent) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (authenticatedStudent.studentId.toString() !== studentId) {
    return res.status(403).json({ msg: 'You are not the owner of this profile' });
  }

  if (!about && !collegeName && !major && !profilePic) {
    return res.status(400).json({ msg: 'Please provide at least one field to update' });
  }

  const student = await Students.findById(studentId);

  if (!student) {
    return res.status(404).json({ msg: 'Student not found' });
  }

  if (about) {
    student.about = about;
  }

  if (collegeName) {
    student.collegeName = collegeName;
  }

  if (major) {
    student.major = major;
  }

  if (profilePic) {
    student.profilePic = profilePic;
  }

  const updatedStudent = await student.save();

  res.status(200).json({
    _id: updatedStudent._id,
    name: updatedStudent.name,
    surname: updatedStudent.surname,
    major: updatedStudent.major,
    collegeName: updatedStudent.collegeName,
    city: updatedStudent.city,
    profilePic: updatedStudent.profilePic,
    about: updatedStudent.about,
    email: updatedStudent.email,
  });
};



const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  // Get the authenticated student from the request
  const authenticatedStudent = req.user;

  if (!authenticatedStudent) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (authenticatedStudent.studentId.toString() !== studentId) {
    return res.status(403).json({ msg: 'You are not the owner of this profile' });
  }

  const student = await Students.findById(studentId);

  if (!student) {
    return res.status(404).json({ msg: 'Student not found' });
  }

  await student.deleteOne();

  res.status(200).json({ msg: 'Student deleted successfully' });
};


module.exports= {registerStudent, loginStudent, logoutStudent, getAllStudents, updateStudent, deleteStudent};