"use strict"

const {
    Schema,
    model
} = require('mongoose'); // Erase if already required
const DOUCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    privateKey: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: Array,
        default: []
    },

}, {
    conllection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOUCUMENT_NAME, keyTokenModel);