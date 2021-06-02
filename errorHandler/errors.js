
class httpError extends Error{
    httpCode;
    constructor(msg,httpCode){
        super(msg);
        this.httpCode = httpCode;
    }
}

module.exports = {
    httpError
}