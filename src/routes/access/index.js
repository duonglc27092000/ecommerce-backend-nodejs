"use strict"

const express = require('express')
const {
    asyncHandler
} = require('../../Auth/checkAuth')
const accessController = require('../../controllers/access.controller')
const {
    authentication
} = require('../../Auth/anthUtils')
const router = express.Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

/// authentication
router.use(authentication)
//
router.post('/shop/logout', asyncHandler(accessController.logout))

module.exports = router