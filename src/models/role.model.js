"use strict"

const {
    model,
    Schema
} = require('mongoose');

const DOUCUMENT_NAME = 'Role'
const COLLECTION_NAME = 'Roles'

const roleSchema = new Schema({
        rol_name: {
            type: String,
            default: 'user',
            enmu: ['user', 'shop', 'admin']
        },
        rol_slug: {
            type: String,
            default: ''
        },
        rol_description: {
            type: String,
            default: ''
        },
        rol_grants: [{
            resource: {
                type: Schema.Types.ObjectId,
                ref: 'Resource',
                required: true
            },
            actions: [{
                type: String,
                required: true
            }],
            attibutes: {
                type: String,
                default: '*'
            }
        }]

    }, {
        timestamps: true,
        collection: COLLECTION_NAME
    }

)

module.exports = model(DOUCUMENT_NAME, roleSchema)