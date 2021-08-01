const router = require('express').Router();
const users = require('../controllers/users')
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn } = require('../utils/middleware')
const multer = require('multer');
const { storage } = require('../utils/cloudinary')
const parser = multer({ storage })

router.post('/register', wrapAsync(users.register))

router.post('/login', wrapAsync(users.login))

router.route('/profile')
    .get(isLoggedIn, wrapAsync(users.getMyProfile))
    .put(isLoggedIn, parser.single('profile_img'), wrapAsync(users.editMyProfile))

router.get('/profile/:id', isLoggedIn, wrapAsync(users.getTheirProfile))

router.get('/history/events/participated', isLoggedIn, wrapAsync(users.getParticipatedEvents))

router.get('/history/events/recruited', isLoggedIn, wrapAsync(users.getRecruitedEvents))


router.get('/history/news', isLoggedIn, wrapAsync(users.getNews))

router.delete('/logout', isLoggedIn, wrapAsync(users.logout))




module.exports = router;