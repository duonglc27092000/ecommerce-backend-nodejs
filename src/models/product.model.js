"use strict"
//  chấm than dmbg
const {
    model,
    Schema,
    Types
} = require('mongoose'); // Erase if already required

const DOUCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
// Declare the Schema of the Mongo model
const productSchema = new Schema({
    product_name: {
        type: String,
        require: true
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: String,
    product_price: {
        type: Number,
        require: true
    },
    product_quantity: {
        type: Number,
        require: true
    },
    product_type: {
        type: String,
        require: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: String,
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// define the product type  = clothing
const clothingSchema = new Schema({
        brand: {
            type: String,
            require: true
        },
        size: String,
        material: String
    }, {
        collection: 'clothes',
        timestamps: true
    }

)
// define the product type  = clothing
const electronicsSchema = new Schema({
        manufacturer: {
            type: String,
            require: true
        },
        model: String,
        color: String
    }, {
        collection: 'Electronic',
        timestamps: true
    }

)


//Export the model
module.exports = {
    product: model(DOUCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicsSchema),
    clothing: model("Clothing", clothingSchema)
}