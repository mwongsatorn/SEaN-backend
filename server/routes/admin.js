const router = require('express').Router();
const admin = require('../controllers/admin')
const {isLoggedIn, isAdmin} = require('../utils/middleware')
const wrapAsync = require('../utils/wrapAsync')

// Get all of unverified activities
router.get('/activities', isLoggedIn, isAdmin, wrapAsync(admin.pendingActivities))

// Get/Verify/Reject a unverified activities
router.route('/activities/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.checkActivity))

// Get all of unverified news
router.get('/news', isLoggedIn, isAdmin, wrapAsync(admin.pendingNews))

// Get//Verify/Reject a unverified news
router.route('/news/:id')
    .post(isLoggedIn, isAdmin, wrapAsync(admin.checkNews))

router.post('/announcements', isLoggedIn, isAdmin, wrapAsync(admin.createAnnouncement))

router.route('/announcements/:id')
    .put(isLoggedIn, isAdmin, wrapAsync(admin.editAnnouncement))
    .delete(isLoggedIn, isAdmin, wrapAsync(admin.deleteAnnouncement))

module.exports = router