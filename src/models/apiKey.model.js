"use strict"
//  chấm than dmbg
const {
    model,
    Schema,

} = require('mongoose'); // Erase if already required

const DOUCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'
// Declare the Schema of the Mongo model
const apiKeySchema = new Schema({

    key: {
        type: String,
        unique: true,
        repuire: true,
    },

    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        require: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOUCUMENT_NAME, apiKeySchema);