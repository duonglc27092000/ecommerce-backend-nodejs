'use strict'

const _ = require('lodash')
const {
    Types
} = require('mongoose')
const convertToObjectIdMongodb = id => {
    return new Types.ObjectId(id)
}
const getInfoData = ({
    fields = [],
    object = {}
}) => {
    return _.pick(object, fields)
}
// ['a','b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// ['a','b'] => {a: 0, b: 0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

/*
const a = {
    c:{
        d:1
    }
}

db.conllection.updateOne({
    `c.d`:1
})

*/
const updateNestedObjectParser = obj => {
    console.log(`[1]::`, obj)
    const final = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] == 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    console.log(`[2]::`, obj)

    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}