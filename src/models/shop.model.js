"use strict"
//  chấm than dmbg
const {
    model,
    Types,
    Schema
} = require('mongoose'); // Erase if already required
const DOUCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'
// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true,

    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verfify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOUCUMENT_NAME, shopSchema);