const router = require('express').Router();
const admin = require('../controllers/admin')
const {isLoggedIn, isAdmin} = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync')

router.get('/events/', isLoggedIn, isAdmin, wrapAsync(admin.pendingEvents))

router.route('/events/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.changeEventStatus))

router.get('/news', isLoggedIn, isAdmin, wrapAsync(admin.pendingNews))

router.route('/news/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.changeNewsStatus))

router.post('/announcements', isLoggedIn, isAdmin, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(admin.createAnnouncement))

router.route('/announcements/:id')
    .put(isLoggedIn, isAdmin, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(admin.updateAnnouncement))
    .delete(isLoggedIn, isAdmin, wrapAsync(admin.deleteAnnouncement))

module.exports = router