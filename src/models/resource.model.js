"use strict"

const {
    model,
    Schema
} = require('mongoose');

const DOUCUMENT_NAME = 'Resource'
const COLLECTION_NAME = 'Resources'

const resourceSchema = new Schema({
        src_name: {
            type: String,
            required: true
        },
        src_slug: {
            type: String,
            required: true
        },
        src_desscription: {
            type: String,
            default: ''
        },


    }, {
        timestamps: true,
        collection: COLLECTION_NAME
    }

)

module.exports = model(DOUCUMENT_NAME, resourceSchema)