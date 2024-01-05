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

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('', asyncHandler(ProductController.findAllProducts))
router.get('/:product_id', asyncHandler(ProductController.findProduct))

/// authentication
router.use(authenticationV2)
//
router.post('/', asyncHandler(ProductController.createProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsShop))
router.get('/publish/all', asyncHandler(ProductController.getAllPublishShop))

module.exports = router