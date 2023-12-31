'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const {
    AuthFailureError,
    NotFoundError
} = require('../core/error.response')
const {
    findByUserId
} = require('../services/keyToken.service')

const HEADER = {
    AIP_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-token-id'

}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken 
        const accessToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })
        // refreshToken 
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify : `, err)
            } else {
                console.log(`decode verify :`, decode)
            }
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        return error
    }
}

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**
     * 1 check userId missing ??
     * 2 get accessToken
     * 3 verifyToken
     * 4 check user in dbs
     * 5 check keyStore with this userId?
     * 6 ok all => return next()
     */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request ! - userId authenticationV2 - 1')
    //2 
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found KeyStore')
    //3
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId ! - 1 ')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request ! - accessToken')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId !')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})
const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 check userId missing ??
     * 2 get accessToken
     * 3 verifyToken
     * 4 check user in dbs
     * 5 check keyStore with this userId?
     * 6 ok all => return next()
     */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request ! - userId 11')
    //2 
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found KeyStore')
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request ! - accessToken')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId !')
        req.keyStore = keyStore
        req.user = decodeUser //{ userId, email}
        console.log('decodeUser.userID :::', decodeUser.userId)

        return next()

    } catch (error) {
        console.log('userID :::', userId)
        console.log("error here 121")
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}