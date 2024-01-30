'use strict'

const CartService = require("../services/cart.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const {
    SuccessResponse
} = require('../core/success.response')

class CartController {
    // /**
    //  * 
    //  * @param {int} User 
    //  * @param {*} req 
    //  * @param {*} next 
    //  * @method POST
    //  * @url /v1/api/cart/user
    //  * @return {
    //  * }
    //  */
    addToCart = async (res, req, next) => {
        //new 
        new SuccessResponse({
            message: 'Create new Cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    update = async (res, req, next) => {
        //update
        new SuccessResponse({
            message: 'Update new Cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (res, req, next) => {
        //delete
        new SuccessResponse({
            message: 'Delete Cart success',
            metadata: await CartService.deleteCart(req.body)
        }).send(res)
    }
    listToCart = async (res, req, next) => {
        //getListToCart
        new SuccessResponse({
            message: 'List Cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}
module.exports = new CartController()