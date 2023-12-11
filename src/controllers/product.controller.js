"use strict"

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const {
    SuccessResponse
} = require('../core/success.response')

class ProductController {

    createProduct = async (req, res, next) => {

        // new SuccessResponse({
        //     message: 'Create new Product  Success',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.UserId
        //     })
        // }).send(res)

        new SuccessResponse({
            message: 'Create new Product  Success',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.UserId
            })
        }).send(res)

    }


}
module.exports = new ProductController()