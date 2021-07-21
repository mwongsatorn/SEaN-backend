const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary')
const parser = multer({ storage })
const events = require('../controllers/events')
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn } = require('../utils/middleware')

// Get all events/Create a new activity
router.route('/')
    .get(isLoggedIn, wrapAsync(events.index))
    .post(isLoggedIn, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(events.createActivity))

// Get/Edit/Delete a specific activity
router.route('/:id')
    .get(isLoggedIn, wrapAsync(events.getActivity))
    .put(isLoggedIn, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(events.updateActivity))
    .delete(isLoggedIn, wrapAsync(events.deleteActivity))

router.post('/:id/apply', isLoggedIn, wrapAsync(events.applyEvent))

router.post('/:id/cancel', isLoggedIn, wrapAsync(events.cancelEvent))

module.exports = router;