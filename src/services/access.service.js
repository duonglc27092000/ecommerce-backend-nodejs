"use strict"
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {
    ConflictRequestError,
    BadRequestError
} = require('../core/error.response')
const {
    getInfoData
} = require('../utils/index')
const KeyTokenService = require('./keyToken.service')
const {
    createTokenPair
} = require('../Auth/anthUtils')
const RoleShop = {
    SHOP: 'SHOP',
    WRITEE: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    /*
    1 - check email in dbs
    2 - match password
    3 - create AT vs RT and save
    4 - generate tokens
    5 - get data return login
    */
    static login = async ({
        email,
        password,
        refreshToken = null
    }) => {

    }

    static signUp = async ({
        name,
        email,
        password
    }) => {
        // try {
        // step1 :check mail exits ?
        const holderShop = await shopModel.findOne({
            email
        }).lean()
        if (holderShop) {

            throw new BadRequestError('Error : Shop already registered!')
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        })
        if (newShop) {

            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')
            console.log(privateKey, publicKey) // save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return {

                    code: 'xxxx',
                    message: 'publicKeyString error!'
                }
            }
            //create token pair

            const tokens = await createTokenPair({
                userId: newShop._id,
                email
            }, publicKey, privateKey)

            console.log(`Create tokens success : `, tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
            }
            // const tokens = await 
        }
        return {
            code: 201,
            metadata: null
        }
        // } catch (error) {
        // return {
        //     code: 'xxx',
        //     message: error.message + ' Duongh399',
        //     status: 'error'
        // }
        // }
    }
}

module.exports = AccessService