'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFILCT: 409
}
const ReasonStatusCode = {
    FORBIDDEN: 'Dad request error',
    CONFILCT: 'Conflict error'
}
const ReasonPhrases = {
    UNAUTHORIZED: 'unauthenticated'
}
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}