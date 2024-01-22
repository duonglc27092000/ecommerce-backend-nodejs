'use strict'
const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')
const {
    convertToObjectIdMongodb
} = require('../utils')
const discount = require('../models/discount.model')
const {
    findAllProducts,
} = require('../models/repositories/product.repo')
const {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExists
} = require('../models/repositories/discount.repo')

const {
    product
} = require('../models/product.model')
const {
    Types
} = require('mongoose')
/**
 Discount Services
 1- Generator  Discount Code [Shop | Admin]
 2- Get Discount amount [User]   
 3- Get all discount codes [User | Shop]
 4- Verify discount code [Admin | Shop]
 5- Delete discount Code [Admin | Shop]
 6- Cancel discount code [user]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used
        } = payload
        // kiem tra 
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expried!')
        // }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }
        console.log(" -- Duongh399 --")
        // create index for discount code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })
        return newDiscount
    }
    static updateDiscountCode() {
        ///.......
    }
    /// Get all discount codes available with products

    static async getAllDiscountCodesWithProduct({
        code,
        shopId,
        userId,
        limit,
        page
    }) {
        // create index for discount_code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()
        console.log("foundDiscount :::", foundDiscount)
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists! - 108')
        }
        const {
            discount_applies_to,
            discount_product_ids
        } = foundDiscount
        let products
        if (discount_applies_to == 'all') {
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to == 'specific') {
            // get the product ids
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: discount_product_ids
                    },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products

    }
    static async getAllDiscountCodeByShop({
        limit,
        page,
        shopId

    }) {
        const discounts = await findAllDiscountCodeSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_name', 'discount_code'],
            model: discount
        })
        return discounts
    }
    static async getDiscountAmount({
        codeId,
        userId,
        shopId,
        products
    }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                // discount_code: "SHOP-1122",
                discount_shopId: convertToObjectIdMongodb(shopId),
                // discount_shopId: convertToObjectIdMongodb("65a3244cd3e3ab4c07cbdd49")

            }
        })
        console.log("foundDis :::", foundDiscount)
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exits`)

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError(`discount expried!`)
        if (!discount_max_uses) throw new NotFoundError(`discount expried!`)

        // console.log(discount_is_active)
        // console.log(discount_max_uses)

        // if (new Date() < new Date(discont_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new BadRequestError(`discount ecode has expried !`)
        // }
        // check xem cos gia tri toi thieu hay khong
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}! `)

            }
        }
        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(user => user.userId == userId)
            if (userDiscount) {
                //.........
            }
        }
        // check xem discount nay la fixed_amount 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder, // gia cu
            discount: amount, // duoc giam 
            totalPrice: totalOrder - amount // gia sau khi giam gia
        }

    }
    static async deleteDiscountCode({
        shopId,
        codeId
    }) {
        // chuẩn ra thì nên check xem discount có đang được sử dụng không dể có hướng giải quyết tốt hơn
        // còn đây là xóa bất chấp
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }

    // Cancel Disount Code ()

    static async cancelDiscountCode({
        codeId,
        shopId,
        userId
    }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: Types.ObjectId(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exits`)
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            }

        })
        return result
    }

}
module.exports = DiscountService