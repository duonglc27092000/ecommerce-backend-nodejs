require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const {
    default: helmet
} = require('helmet')
const compression = require('compression')
const app = express();

// init middleware
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(helmet())
app.use(compression());

// init db 
require('./dbs/init.mongodb')
// const {
//     checkOverLoad
// } = require('./helpers/check.connect')
// checkOverLoad()
// init routes
app.get('/', (req, res, next) => {
    // const strCompress = 'Duongh399'
    return res.status(200).json({

        message: 'Wellcome Nodejs server',
        // metadata: strCompress.repeat(1000)
    })
})
// handling error 

module.exports = app