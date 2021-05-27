class HttpError extends Error {

    constructor({ code, message }) {
        super();
        this.error = true;
        this.name = this.constructor.name;
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }

}
  
class HttpBadRequest extends HttpError {

    constructor(message = 'Bad request') {
        super({
            code: 400,
            message: message,
            // error: ErrorMapping.BAD_REQUEST
        });
    }

}

class HttpUnauthorized extends HttpError {

    constructor(message = 'Unauthorized') {
        super({
            code: 401,
            message: message,
            // error: ErrorMapping.UNAUTHORIZED
        });
    }

}

class HttpForbidden extends HttpError {

    constructor(message = 'Forbidden') {
        super({
            code: 403,
            message: message,
            // error: ErrorMapping.FORBIDDEN
        });
    }

}

class HttpNotFound extends HttpError {

    constructor(message = 'No Found') {
        super({
            code: 404,
            message: message,
            // error: ErrorMapping.NOT_FOUND
        });
    }
    
}

module.exports = {
    HttpError,
    HttpBadRequest,
    HttpUnauthorized,
    HttpForbidden,
    HttpNotFound
}
