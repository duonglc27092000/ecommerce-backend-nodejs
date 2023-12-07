"use strict"

const AccessService = require("../services/access.service")
const {
    OK,
    CREATED,
    SuccessResponse
} = require('../core/success.response')

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
        // return res.status(201).json(await AccessService.login(req.body))
k
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK !',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))
    }

}
module.exports = new AccessController()