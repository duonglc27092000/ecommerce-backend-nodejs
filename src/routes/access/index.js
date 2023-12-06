"use strict"

const express = require('express')
const {asyncHandler} = require('../../Auth/checkAuth')
const accessController = require('../../controllers/access.controller')
const router = express.Router()


router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))
module.exports = router