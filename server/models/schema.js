// Require mongoose and mongoose schema
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    id: Number,
    name: String,
    brand: String,
    desc: String,
    price: Number,
    img: String,
    cat: Number,
    gender: Number,
    qty: Number
}, {timestamps: true} );

const userSchema = new Schema({
    id: Number,
    login: String,
    pass: String
});

module.exports.articles = mongoose.model('Articles', articleSchema,'articles');
module.exports.users = mongoose.model('Users', articleSchema,'users');
