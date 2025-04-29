require('dotenv').config();
const express= require('express');
const app= express();
const PORT= 3000;
const mongoose= require('mongoose');
const studentRoute= require('./routes/studentRoute');
const studyNoteRoute= require('./routes/studyNoteRoute');
const authenticateStudent= require('./auth/authenticateStudent');
const commentRoute= require('./routes/commentRoute');
const commentLkesRoute= require('./routes/commentLikesRoute');
const repliesRoute= require('./routes/repliesRoute');
const nestedRepliesRoute= require('./routes/nestedRepliesRoutes');
const replyLikesRoute= require('./routes/replyLikesRoute');
const messagesRouter= require('./routes/messagesRoute');
const globalMessagesRouter= require('./routes/globalMessagesRoute');
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 } // Set the cookie expiration time
  }));
  
  app.use(cookieParser())

app.use(express.json());
app.use('/api/students', studentRoute);
app.use('/api/studynotes', studyNoteRoute);
app.use('/api/comments', authenticateStudent, commentRoute);
app.use('/api/comments/likes', authenticateStudent, commentLkesRoute);
app.use('/api/comments/replies', authenticateStudent, repliesRoute );
app.use('/api/comments/replies', authenticateStudent, nestedRepliesRoute );
app.use('/api/comments/replies', authenticateStudent, replyLikesRoute);
app.use('/api/chats/', authenticateStudent, messagesRouter);
app.use('/api/globalchats/', authenticateStudent, globalMessagesRouter);


/* CONNECT TO MONGO DB */
mongoose.connect(process.env.MONGO_URI);
const db= mongoose.connection;
db.once('open', ()=>{
console.log('connected to mongodb')
 })
 db.on('error', ()=>{
    console.log('failed to connect to database')
})
app.listen(PORT, ()=>{
    console.log('server started on port ', PORT);
})