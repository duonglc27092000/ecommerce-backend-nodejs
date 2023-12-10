"use strict"

const {
    clothing,
    product,
    electronic
} = require('../models/product.model')

const {
    BadRequestError
} = require('../core/error.response')
//define Factory class to create product

class ProductFactory {
    /*
    type: "Clothing"
    payload
    */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Clothing':
                return new Clothing(payload).createProduct()
            case 'Electronics':
                return new Electronics(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}


class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_quantity,
        product_price,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_quantity = product_quantity
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    // create  new product
    async createProduct() {
        return await product.create(this)
    }
}
// define  sub-class for different product type Clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('crete new Clothing error!')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('crete new Product error!')

        return newProduct
    }
}
// define  sub-class for different product type Electronics

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronic.create(this.product_attributes)
        if (!newElectronics) throw new BadRequestError('crete new Electronics error!')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('crete new Product error!')

        return newProduct
    }
}
module.exports = ProductFactory