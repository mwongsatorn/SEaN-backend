function wrapAsync(callback) {
    return function(req, res, next) {
        callback(req, res, next).catch(e => next(e));
    }
}

module.exports = wrapAsync