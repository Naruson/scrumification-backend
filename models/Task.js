const mongoose = require('mongoose');
const database = require('../configs/database');
const Schema = mongoose.Schema;

let taskSchema = new Schema({
    name: {
        type: String
    },
    point: {
        type: Int16Array
    },
    created_at: {
        type: String
    }
}, {
    collection: 'tasks',
})

module.exports = mongoose.model('Account', taskSchema);