const express = require('express');
require('express-async-errors');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer')

dotenv.config();
app.use(express.json());

const mongoose = require('mongoose');
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/user')
const postRoute = require('./routes/post')
const categoryRoute = require('./routes/categories')

const errorHandlerMiddleware = require('./middleware/error-handler')



mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    }, filename: (req, file, cb) => {
        cb(null, 'hello.jpeg')
    }
})

const upload = multer({ storage:storage });
app.post('/api/upload', upload.single('file'), (req, res)=> {
    res.status(200).json('file uploaded successfully');
})

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);

app.use(errorHandlerMiddleware);


app.listen('5000', () => {
    console.log('Backend is running');
})