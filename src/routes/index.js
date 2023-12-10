"use strict"

const express = require('express')
const {
    apiKey,
    permission
} = require('../Auth/checkAuth')
const router = express.Router()

// check aipKey
router.use(apiKey)
//check permissions
router.use(permission('0000'))


router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
// router.get('', (req, res, next) => {

//     return res.status(200).json({

//         message: 'Wellcome Nodejs server',

//     })
// })
module.exports = router