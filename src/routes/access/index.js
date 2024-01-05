"use strict"

const express = require('express')
const {
    asyncHandler
} = require('../../Auth/checkAuth')
const accessController = require('../../controllers/access.controller')
const {
    authentication,authenticationV2
} = require('../../Auth/anthUtils')
const router = express.Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

/// authentication
router.use(authenticationV2)
//
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router