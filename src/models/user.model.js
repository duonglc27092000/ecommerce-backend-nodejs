"use strict"

const {
    model,
    Schema
} = require('mongoose');

const DOUCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema({
        user_id: {
            type: Number,
            required: true
        }, //user
        user_slug: {
            type: String,
            required: true
        },
        user_name: {
            type: String,
            default: ''
        },
        user_password: {
            type: String,
            default: ''
        },
        user_saft: {
            type: String,
            default: ''
        },
        user_email: {
            type: String,
            required: true

        },
        user_phone: {
            type: String,
            default: ''
        },
        user_sex: {
            type: String,
            default: ''
        },
        user_avatar: {
            type: String,
            default: ''
        },
        user_date_of_birth: {
            type: String,
            default: null
        },
        user_role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'

        },
        user_status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'active', 'block']
        },

    }, {
        timestamps: true,
        collection: COLLECTION_NAME
    }

)

module.exports = model(DOUCUMENT_NAME, userSchema)