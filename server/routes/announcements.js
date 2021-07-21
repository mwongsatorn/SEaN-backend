const router = require('express').Router();
const announcements = require('../controllers/announcements')
const wrapAsync = require('../utils/wrapAsync')
const { authenticateUser } = require('../utils/middleware')

router.get('/', authenticateUser, wrapAsync(announcements.index))

router.get('/:id', authenticateUser, wrapAsync(announcements.getAnnouncement))

module.exports = router