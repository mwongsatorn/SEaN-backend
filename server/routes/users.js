const router = require('express').Router();
const users = require('../controllers/users')
const wrapAsync = require('../utils/wrapAsync')
const { authenticateUser } = require('../utils/middleware')
const multer = require('multer')
const { storage } = require('../utils/cloudinary')
const upload = multer({ storage })

//Register
router.post('/register', wrapAsync(users.register))

//Login
router.post('/login', wrapAsync(users.login))

//Get/Edit profile
router.route('/profile')
    .get(authenticateUser , wrapAsync(users.getProfile))
    .put(authenticateUser , wrapAsync(users.editProfile))

//Get all of participated activities history from user
router.get('/history/activities/participated', authenticateUser, wrapAsync(users.getParticipatedActs))

//Get all of recruitment activities history from user
router.get('/history/activities/recruited', authenticateUser, wrapAsync(users.getRecruitedActs))

router.get('/history/activities/upcoming', authenticateUser, wrapAsync(users.getUpcomingActs))

//Get all of news history from user
router.get('/history/news', authenticateUser, wrapAsync(users.getNews))

//Logout
router.delete('/logout', wrapAsync(users.logout))




module.exports = router;