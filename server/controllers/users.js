const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { userSchema } = require('../utils/joi')

module.exports.getProfile = async (req,res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id).select({
        firstname: 1,
        lastname: 1,
        email: 1,
        status: 1,
        status_id: 1,

    });
    res.json(foundUser);
};

module.exports.editProfile = async (req,res) => {
    const {_id} = req.user;
    await User.updateOne(_id, req.body)
    res.end()
}

module.exports.getParticipatedEvents = async (req, res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id).select({
        _id: 0,
        history: 1
    }).populate({
        path: 'history',
        populate: {
            path: 'event',
            populate: {
                path: 'participated'
            }
        }
    });
    res.json(foundUser)
}

module.exports.getRecruitedEvents = async (req,res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id).select({
        _id: 0,
        history: 1
    }).populate({
        path: 'history',
        populate: {
            path: 'event',
            populate: {
                path: 'recruited'
            }
        }
    })
    res.json(foundUser)
}

// module.exports.getUpcomingEvents = async (req, res) => {
//     const {_id} = req.user;
//     console.log(new Date())
//     const foundUser = await User.findById(_id)
//     .select({
//         _id: 0,
//         history: 1
//     }).populate({
//         path: 'history',
//         populate: {
//             path: 'event',
//             populate: {
//                 path: 'participated',
//                 match: {
//                     start_date: {$lt: new Date().getTime()}
//                 }
//             }
//         }
//     })

//     res.json(foundUser)
// }

module.exports.getNews = async (req,res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id).select({
        _id: 0,
        history: 1
    }).populate({
        path: 'history',
        populate: {
            path: 'news'
        }
    })
    res.json(foundUser);
}

module.exports.login = async (req,res,next) => {
    await loginValidationSchema.validateAsync(req.body, {abortEarly: false})
    const { username , password } = req.body
    const foundUser = await User.findOne({username: username})
    if (!foundUser) throw new errorHandler("Username or password is incorrect", 400);
    const validPassword = await bcrypt.compare(password, foundUser.password)
    if (!validPassword) throw new errorHandler("Username or password is incorrect", 400); 

    const accessToken = jwt.sign({_id: foundUser._id, role: foundUser.role},process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign({_id: foundUser._id, role: foundUser.role},process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    foundUser.refresh_token = refreshToken;
    await foundUser.save();

    res.cookie('access_token', accessToken, {
        httpOnly: true,
    }).cookie('refresh_token', refreshToken, {
        httpOnly: true,
    })

    res.end();
}

module.exports.logout = async (req,res) => {
    const { refresh_token } = req.cookies
    const { id } = req.params
    if(!refresh_token) return res.end();
    const currentUser = await User.findOneAndUpdate({_id: id,refresh_token: refresh_token},
        {$set: {refresh_token: ""}},
        {runValidators: true, new: true})
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.end()
}

module.exports.register = async (req,res) => {      
    //Validating data from body
    await registerValidationSchema.validateAsync(req.body, {abortEarly: false})

    //Checking if email/username already exist
    const existEmail = await User.findOne({email: req.body.email})
    if(existEmail) throw new errorHandler("This email already exists", 400)
    const existUserName = await User.findOne({username: req.body.username})
    if(existUserName) throw new errorHandler("This username already exist", 400)
        
    //Hashing the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create new user and save to database
    const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        status_id: req.body.status_id,
        status: req.body.status,
        faculty: req.body.faculty,
        department: req.body.department,
        tel_no: req.body.tel_no
    })

    await newUser.save();

    res.json(newUser)
}