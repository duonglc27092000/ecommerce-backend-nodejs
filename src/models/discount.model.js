"use strict"

const {
    Schema,
    model
} = require('mongoose'); // Erase if already required
const DOUCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'
// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_description: {
        type: String,
        required: true
    },
    discount_type: {
        type: String,
        default: 'fixed_amount'
    }, // percentage
    discount_value: {
        type: Number,
        required: true
    }, // 10.000,10
    discount_code: {
        type: String,
        required: true
    }, //discountCode
    discount_start_date: {
        type: Date,
        requied: true
    }, //ngay bat dau
    discount_end_date: {
        type: Date,
        requied: true
    }, //ngay ket thuc
    discount_max_uses: {
        type: Number,
        required: true
    }, // so luong discount duowc ap dung
    discount_uses_count: {
        type: Number,
        required: true
    }, // so discount da su dung

    discount_users_used: {
        type: Array,
        default: []
    }, //ai da dung
    discount_max_uses_per_user: {
        type: Number,
        requied: true
    }, //so luong cho phep toi da duoc su dung moi user
    discount_min_order_value: {
        type: Number,
        required: true
    },
    discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },

    discount_is_active: {
        type: Boolean,
        default: true
    },
    discount_applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    discont_product_ids: {
        type: Array,
        default: []
    } //so san pham da duoc ap dung

}, {
    conllection: COLLECTION_NAME,
    timestamps: true
});


//Export the model
module.exports = {
    discount: model(DOUCUMENT_NAME, discountSchema)
}