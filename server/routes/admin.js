const router = require('express').Router();
const admin = require('../controllers/admin')
const {isLoggedIn, isAdmin} = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync')

router.get('/events/', isLoggedIn, isAdmin, wrapAsync(admin.pendingEvents))

router.route('/events/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.changeEventStatus))

router.get('/news', isLoggedIn, isAdmin, wrapAsync(admin.pendingNews))

router.route('/news/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.checkNews))

router.post('/announcements', isLoggedIn, isAdmin, wrapAsync(admin.createAnnouncement))

router.route('/announcements/:id')
    .put(isLoggedIn, isAdmin, wrapAsync(admin.updateAnnouncement))
    .delete(isLoggedIn, isAdmin, wrapAsync(admin.deleteAnnouncement))

module.exports = router