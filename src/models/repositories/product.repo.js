"use strict"

// const {
//     Types
// } = require("mongoose")
const {
    product,
    electronic,
    clothing,
    furniture
} = require("../product.model")
const {
    Types
} = require('mongoose')

const findAllDraftsForShop = async ({
    query,
    limit,
    skip
}) => {
    return await queryProduct({
        query,
        limit,
        skip
    })
}
const findAllPublishForShop = async ({
    query,
    limit,
    skip
}) => {
    return await queryProduct({
        query,
        limit,
        skip
    })
}
const searchProductByUser = async ({
    keySearch
}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublishesd: true,
        $text: {
            $search: regexSearch
        }
    }, {
        score: {
            $meta: 'textScore'
        }
    }).sort({
        score: {
            $meta: 'textScore'
        }
    }).lean()
    return results
}
const publishProductByShop = async ({
    product_shop,
    product_id
}) => {
    const foundShop = product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (foundShop) console.log("foundShop :::=>", foundShop)
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    console.log('foundShop.isDraft ', foundShop.isDraft)
    console.log('foundShop.isPublished ', foundShop.isPublished)
    const {
        modifedCount
    } = await foundShop.updateOne(foundShop)
    console.log("update done !!")
    return modifedCount

}
const unPublishProductByShop = async ({
    product_shop,
    product_id
}) => {
    const foundShop = product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (foundShop) console.log("foundShop :::=>", foundShop)
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    console.log('foundShop.isDraft ', foundShop.isDraft)
    console.log('foundShop.isPublished ', foundShop.isPublished)
    const {
        modifedCount
    } = await foundShop.updateOne(foundShop)
    console.log("update done !!")
    return modifedCount
}
const queryProduct = async ({
    query,
    limit,
    skip
}) => {
    return await product.find(query).populate("product_shop", "name email -_id").sort({
        updateAt: -1
    }).skip(skip).limit(limit).lean().exec()
}
module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
}