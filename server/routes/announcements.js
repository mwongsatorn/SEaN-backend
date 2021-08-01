const router = require('express').Router();
const announcements = require('../controllers/announcements')
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn } = require('../utils/middleware')

router.get('/', isLoggedIn, wrapAsync(announcements.index))

router.get('/:id', isLoggedIn, wrapAsync(announcements.getAnnouncement))

module.exports = router