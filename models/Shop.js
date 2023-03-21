const mongoose = require('mongoose');
const database = require('../configs/database');
const Schema = mongoose.Schema;

let shopSchema = new Schema({
    name: {
        type: String
    },
    point: {
        type: String
    },
    created_at: {
        type: String
    }
}, {
    collection: 'shops',
})

module.exports = mongoose.model('Shop', shopSchema);