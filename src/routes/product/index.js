"use strict"

const express = require('express')
const {
    asyncHandler
} = require('../../Auth/checkAuth')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const {
    authenticationV2
} = require('../../Auth/anthUtils')

/// authentication
router.use(authenticationV2)
//
router.post('/', asyncHandler(ProductController.createProduct))

module.exports = router