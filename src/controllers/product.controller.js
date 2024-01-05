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
                product_shop: req.user.UserId,
            })
        }).send(res)

    }
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'publishProductByShop  Success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.UserId,
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublishProductByShop  Success',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.UserId,
            })
        }).send(res)
    }
    //QUERY //
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsShop = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create list  Draft  Success',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.UserId,
            })
        }).send(res)
    }

    getAllPublishShop = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create list Publised  Success',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.UserId,
            })
        }).send(res)

    }
    getListSearchProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create list getListSearchProduct  Success',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)

    }
    findAllProducts = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create list  findAllProducts  Success',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)

    }
    findProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Create list  findProduct  Success',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)

    }

    // End QUERY//

}
module.exports = new ProductController()