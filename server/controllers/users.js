const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')
const { userSchema } = require('../utils/joi')

module.exports.getMyProfile = async (req,res) => {
    const { _id } = req.user;
    const foundUser = await User.findById(_id)
    res.json(foundUser.toObject());
};

module.exports.updateMyProfile = async (req,res) => {
    const { _id } = req.user;
    const foundUser = await User.findByIdAndUpdate(_id, req.body)
    if(req.file) {
        foundUser.profile_img.url = req.file.path
        foundUser.profile_img.filename = req.file.filename
    }
    await foundUser.save()
    res.end()
}

module.exports.getTheirProfile = async (req, res) => {
    const { id } = req.params
    const foundUser = await User.findById(id)
    res.json(foundUser.toObject())
}

module.exports.getParticipatedEvents = async (req, res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id)
    .select('history')
    .populate({ path: 'history.events.participated' })
    res.json(foundUser.toObject())
}

module.exports.getRecruitedEvents = async (req,res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id)
    .select('history')
    .populate({ path: 'history.events.recruited' })
    res.json(foundUser)
}

module.exports.getNewsHistory = async (req,res) => {
    const {_id} = req.user;
    const foundUser = await User.findById(_id)
    .select('history')
    .populate({ path: 'history.news' })
    res.json(foundUser);
}

module.exports.login = async (req,res,next) => {
    await userSchema.validateAsync(req.body, {abortEarly: false})
    const { username , password } = req.body
    const foundUser = await User.findOne({username: username})
    if (!foundUser) throw new errorHandler("Username or password is incorrect", 400);
    const validPassword = await bcrypt.compare(password, foundUser.password)
    if (!validPassword) throw new errorHandler("Username or password is incorrect", 400); 

    const accessToken = jwt.sign({ _id: foundUser._id, role: foundUser.role },process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign({_id: foundUser._id, role: foundUser.role},process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    foundUser.refresh_token = refreshToken;
    await foundUser.save();

    res.cookie('access_token', accessToken, { httpOnly: true })
    .cookie('refresh_token', refreshToken, { httpOnly: true })

    res.end();
}

module.exports.logout = async (req,res) => {
    const { refresh_token } = req.cookies
    if(!refresh_token) return res.end();
    const query = await User.updateOne({ _id: req.user._id, refresh_token: refresh_token },{ refresh_token: "" })
    if(query.nModified == 0) throw new errorHandler("You are not logged in", 400)
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.end()
}

module.exports.register = async (req,res) => {      
    await userSchema.validateAsync(req.body)
    const existEmail = await User.findOne({email: req.body.email})
    if(existEmail) throw new errorHandler("This email already exists", 400)
    const existUserName = await User.findOne({username: req.body.username})
    if(existUserName) throw new errorHandler("This username already exist", 400)

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

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