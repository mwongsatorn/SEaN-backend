const router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync')
const news = require('../controllers/news')
const { isLoggedIn } = require('../utils/middleware')

router.get('/', isLoggedIn, wrapAsync(news.index))

router.post('/', isLoggedIn, wrapAsync(news.createNews))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(news.getNews))
    .put(isLoggedIn, wrapAsync(news.updateNews))
    .delete(isLoggedIn, wrapAsync(news.deleteNews))

module.exports = router