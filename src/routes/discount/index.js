"use strict"

const express = require('express')
const {
    asyncHandler
} = require('../../Auth/checkAuth')
const router = express.Router()
const DiscountController = require('../../controllers/discount.controller')
const {
    authenticationV2
} = require('../../Auth/anthUtils')

const discountController = require('../../controllers/discount.controller')

//get amount a discount
router.post('/amount', asyncHandler(DiscountController.getAllDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

/// authentication
router.use(authenticationV2)
//


router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodes))

module.exports = router