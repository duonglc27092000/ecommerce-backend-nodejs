"use strict"

const {
    model,
    Schema
} = require('mongoose');

const DOUCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
        cart_state: {
            type: String,
            required: true,
            enum: ['active', 'completed', 'failed', 'pending'],
            default: 'active'
        },
        cart_products: {
            type: Array,
            required: true,
            default: []
        },
        cart_count_products: {
            type: Number,
            required: true
        },
        cart_userId: {
            type: Number,
            // type: Schema.Types.ObjectId,
            // ref: 'User',
            required: true
        },


    }, {
        // timestamps: true,
        timeseries: {
            createdAt: 'createdON',
            updatedAt: 'updatedON',
        },
        collection: COLLECTION_NAME
    }

)

module.exports = model(DOUCUMENT_NAME, cartSchema)