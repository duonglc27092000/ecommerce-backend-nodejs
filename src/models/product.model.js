"use strict"
//  chấm than dmbg
const {
    model,
    Schema,
    Types
} = require('mongoose'); // Erase if already required
const slugify = require('slugify')
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
    product_slug: String,
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
    product_shop: [{
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }],
    product_attributes: {
        type: Schema.Types.Mixed,
        require: true
    },
    // more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be above 5.0"],
        // 3,424525 => 3,4
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublishesd: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//create index for search
productSchema.index({
    product_name: 'text',
    product_description: 'tett'
})
// document middleware: runs befores .save() and .create()...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, {
        lower: true
    })
    next()
})

// define the product type  = clothing
const clothingSchema = new Schema({
        brand: {
            type: String,
            require: true
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    }, {
        collection: 'clothes',
        timestamps: true
    }

)
// define the product type  = electronic
const electronicsSchema = new Schema({
        manufacturer: {
            type: String,
            require: true
        },
        model: String,
        color: String,
        product_shop: [{
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        }],
    }, {
        collection: 'electronics',
        timestamps: true
    }

)
// define the product type  = Furniture

const furnitureSchema = new Schema({
        manufacturer: {
            type: String,
            require: true
        },
        size: String,
        material: String,
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
        },
    }, {
        collection: 'furnitures',
        timestamps: true
    }

)


//Export the model
module.exports = {
    product: model(DOUCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicsSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema)
}