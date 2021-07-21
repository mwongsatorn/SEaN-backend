const router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync')
const news = require('../controllers/news')
const { authenticateUser } = require('../utils/middleware')

router.get('/', authenticateUser, wrapAsync(news.index))

router.post('/', authenticateUser, wrapAsync(news.createNews))

router.route('/:id')
    .get(authenticateUser, wrapAsync(news.getNews))
    .put(authenticateUser, wrapAsync(news.updateNews))
    .delete(authenticateUser, wrapAsync(news.deleteNews))

module.exports = router