"use strict"

const express = require('express')
const {
    asyncHandler
} = require('../../Auth/checkAuth')
const router = express.Router()
const CartController = require('../../controllers/cart.controller')
// const {
//     authenticationV2
// } = require('../../Auth/anthUtils')

router.post('/', asyncHandler(CartController.addToCart))
router.delete('/', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))
router.get('/', asyncHandler(CartController.listToCart))

module.exports = router