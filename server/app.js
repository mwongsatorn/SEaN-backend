//Import dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { cloudinary } = require('./utils/cloudinary')
const dotenv = require('dotenv')

//Include environment variables
dotenv.config();

//Define option 
const dbOptions = { useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
}
const corsOptions = { credentials: true }

//Database connections
mongoose.connect(process.env.DB_CONNECT, dbOptions)
    .then(() => {
        console.log("DATABASE CONNECTED")
    }).catch(err => {
        console.log("CAN NOT CONNECT TO DATABASE")
        console.log(err)
    })

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//Import routes
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const adminRoute = require('./routes/admin');
const newsRoute = require('./routes/news');
const announcementsRoute = require('./routes/announcements')

//Route middlewares
app.use('/users', usersRoute);
app.use('/events', eventsRoute);
app.use('/admin', adminRoute)
app.use('/news', newsRoute);
app.use('/announcements', announcementsRoute);

//Set port
const port = process.env.PORT || 3000;
app.listen(port,() => console.log("SERVER UP AND RUNNING"));

//Routes
app.get('/',(req,res) => {
    res.send("HOME PAGE")
});

//404 Error handler
app.use((req, res) => {
    res.send("error 404")
})

app.use((err, req, res, next) => {
    console.log(req.files, err)
    const {message, status = 500} = err
    if(err.name === 'ValidationError') {
        if(req.files) {
            for (field in req.files) {
                for (file of req.files[field]) {
                    cloudinary.uploader.destroy(file.filename)
                }
            }
        }
        let messages = [];
        messages = err.message.split('. ')
        return res.status(401).json({error_message: messages})
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({error_message: "login expired"})
    }
    res.status(status)
    res.json({error_message: message})
})
