'use strict'
const keyTokenModel = require('../models/keyToken.model')
const {
    publicKeyeyTokenModel
} = require('../models/keyToken.model')
class KeyTokenService {

    static createKeyToken = async ({
        userId,
        publicKey
    }) => {
        try {
            // level 0
            const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString
            })

            return tokens ? tokens.publicKey : null
            
            // level xxx
            // const filter ={user:userId,update={publicKey,pr}}
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService