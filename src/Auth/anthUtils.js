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
    AUTHORIZATION: 'authorization'
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

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 check userId missing ??
     * 2 get accessToken
     * 3 verifyToken
     * 4 check user in dbs
     * 5 check keyStore with this userId?
     * 6 ok all => return next()
     */

    const userId = req.header[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request ! - userId')
    //2 
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found KeyStore')
    //3
    const accessToken = req.header[HEADER.AUTHORIZATION]
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
module.exports = {
    createTokenPair,
    authentication
}