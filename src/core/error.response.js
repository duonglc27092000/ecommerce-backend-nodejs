'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFILCT: 409
}
const ReasonStatusCode = {
    FORBIDDEN: 'Dad request error',
    CONFILCT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(messgae, status) {
        super(messgae)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(messgae = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(messgae, statusCode)
    }
}
class BadRequestError extends ErrorResponse {
    constructor(messgae = ReasonStatusCode.CONFILCT, statusCode = StatusCode.FORBIDDEN) {
        super(messgae, statusCode)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError
}