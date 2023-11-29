"use strict"
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
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
    static signUp = async ({
        name,
        email,
        password
    }) => {
        try {
            // step1 :check mail exits ?
            const holderShop = await shopModel.findOne({
                email
            }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop Already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })
            if (newShop) {
                // create privateKey, publicKey
                const {
                    privateKey,
                    publicKey
                } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })
                console.log(privateKey, publicKey) // save collection KeyStore

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })
                if (!publicKeyString) {
                    return {

                        code: 'xxxx',
                        message: 'publicKeyString error!'
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                //create token pair

                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKeyString, privateKey)

                console.log(`Create tokens success : `, tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
                // const tokens = await 
            }
            return {
                code: 201,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message + ' Duongh399',
                status: 'error'
            }
        }
    }
}

module.exports = AccessService