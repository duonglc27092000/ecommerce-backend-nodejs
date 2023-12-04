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
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db 
require('./dbs/init.mongodb')
// const {
//     checkOverLoad
// } = require('./helpers/check.connect')
// checkOverLoad()
// init routes
app.use('/', require('./routes'))

// handling error 



module.exports = app