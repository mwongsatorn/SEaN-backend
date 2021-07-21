class errorHandler extends Error {
    constructor(msg, stat) {
        super();
        this.message = msg;
        this.status = stat
    }
}

module.exports = errorHandler;