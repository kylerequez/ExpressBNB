const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const accountSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = new model('Account', accountSchema);