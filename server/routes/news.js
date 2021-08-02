const router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync')
const news = require('../controllers/news')
const multer = require('multer');
const { storage } = require('../utils/cloudinary')
const parser = multer({ storage })
const { isLoggedIn } = require('../utils/middleware')

router.get('/', isLoggedIn, wrapAsync(news.index))

router.post('/', isLoggedIn, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(news.createNews))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(news.getNews))
    .put(isLoggedIn, parser.fields([{name: 'images'},{name: 'cover_img'}]), wrapAsync(news.updateNews))
    .delete(isLoggedIn, wrapAsync(news.deleteNews))

module.exports = router