const jwt = require('jsonwebtoken');
const User = require('../models/User')
const errorHandler = require('./errorHandler')

async function isLoggedIn(req, res, next) {
    const { access_token, refresh_token } = req.cookies;

    if(!access_token) return next(new errorHandler("You can not access to this content",401));

    try {
        const currentUser = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET)
        req.user = currentUser;
        next();        
    }
    catch(e) {
        if (e.name === 'TokenExpiredError') {
            const currentUser = await User.findOne({refresh_token: refresh_token})
            if(!currentUser) return next(new errorHandler("You can not access to this content",401));
            const user = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = jwt.sign({_id: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET)
            res.cookie('access_token', newAccessToken, {
                httpOnly: true,
            })
            req.user = user;
            next();
        }
    }
}

async function isAdmin(req,res,next) {
    const {role} = req.user
    if(role != 'Admin') return next(new errorHandler('You can not access to this content', 401))
    next();
}

module.exports = {
    isLoggedIn,
    isAdmin
}