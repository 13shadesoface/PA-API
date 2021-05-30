/**
 * error class used for internal errors, 500 http code
 */
class internalError extends Error {
    httpCode;
    constructor(msg){
        super(msg);
        this.httpCode = 500;
    }
}

/**
 * error class used for bad request, 400 http code
 */
class badRequestError extends Error {
    httpCode;
    specificCode;
    constructor(specificCode, msg){
        super(msg);
        this.httpCode = 400;
        this.specificCode = specificCode;
    }
}

module.exports = {
    internalError,
    badRequestError
}