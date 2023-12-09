"use strict"
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {
    AuthFailureError,
    ConflictRequestError,
    BadRequestError,
    ForbidenError
} = require('../core/error.response')
const {
    getInfoData
} = require('../utils/index')
const KeyTokenService = require('./keyToken.service')
const {
    createTokenPair,
    verifyJWT
} = require('../Auth/anthUtils')

///service 

const {
    findByEmail
} = require('./shop.service')
const {
    keysIn
} = require('lodash')

const RoleShop = {
    SHOP: 'SHOP',
    WRITEE: '0001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handlerRefreshTokenV2 = async ({
        keyStore,
        user,
        refreshToken
    }) => {
        const {
            userId,
            email
        } = user
        // neu key da dung r thi xoa luon useriD do
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbidenError('Something woring happend!! Pls relogin')

        }
        // neu sai token thi la chua dang ki hoac nhap nham token
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registeted 1')
        const foundShop = await findByEmail({
            email
        })
        if (!foundShop) throw new AuthFailureError('Shop not registeted 2')
        // create 1 cap moi
        const tokens = await createTokenPair({
            userId,
            email
        }, keyStore.publicKey, keyStore.privateKey)
        // update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                findByRefreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
            }
        })
        return {
            user,
            tokens
        }


    }
    static handlerRefreshToken = async (refreshToken) => {
        // check xem token da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // neu co
        if (foundToken) {
            //decode may la thang nao
            const {
                userId,
                email
            } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({
                userId,
                email
            })
            //xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbidenError('Something woring happend!!')
        }
        // NO , ngon qua
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registeted 1')
        // verifyToken
        const {
            userId,
            email
        } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2] --- ', {
            userId,
            email
        })
        // check userId  
        const foundShop = await findByEmail({
            email
        })
        if (!foundShop) throw new AuthFailureError('Shop not registeted 2')
        // create 1 cap moi
        const tokens = await createTokenPair({
            userId,
            email
        }, holderToken.publicKey, holderToken.privateKey)
        // update token
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                findByRefreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
            }
        })
        return {
            user: {
                userId,
                email
            },
            tokens
        }
    }
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyId(keyStore._id)
        console.log({
            delKey
        })
        return delKey
    }
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
        //1.check email in dbs
        const foundShop = await findByEmail({
            email
        })
        if (!foundShop) throw new BadRequestError('Shop not registered!')
        //2.match password
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')
        //3.create AT vs RT and save
        // created privatekey, publickey
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        //4.
        // generate tokens
        const {
            _id: userId
        } = foundShop
        const tokens = await createTokenPair({
            userId,
            email
        }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
            userId
        })
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens

        }
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
            // created privatekey, publickey
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')
            console.log(privateKey, publicKey) // save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError('Error : Key Error')

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