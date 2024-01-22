'use strict'

const DiscountService = require("../services/discount.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const {
    SuccessResponse
} = require('../core/success.response')

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Code Generataions',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Code Found',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }
    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success Code Found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}
module.exports = new DiscountController()