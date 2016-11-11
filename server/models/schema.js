// Require mongoose and mongoose schema
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // Add promise available on mongoose

// Create the main Schema
const Schema = mongoose.Schema;

//Encryption
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Article Schema
const articleSchema = new Schema({
    id: Number,
    id_connect: String,
    name: String,
    email: String,
    brand: String,
    desc: String,
    price: Number,
    img: Array,
    cat: Number,
    idSize: Number,
    idShoes: {
        who: {type: Number},
        size: {type: Number}
    },
    gender: Number,
    qty: Number,
    shopName: String,
    activ: Boolean,
    qa: Array,
    zip: Object,
    id_shop: String,
    loc: {
        type: { type: String },
        coordinates: []
    }
}, {timestamps: true} );

// Specify that the "loc" property is a geospatial object
articleSchema.index({loc: '2dsphere'});


// User Schema
const userSchema = new Schema({
    id_shop: { type: String, required: true },
    credential: { type: String, required: true },
    shopName:{ type: String, required: true, index: { unique: true } },
    login: { type: String, required: true, index: { unique: true } },
    pass: { type: String, required: true },
    desc: String,
    avatar: {type: String}
}, {timestamps: true});

//User shcema middleware to encrypt the password
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('pass')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password 
        bcrypt.hash(user.pass, salt, function(err, hash) {
            if (err) return next(err);

            user.pass = hash;
            next();
        });
    });
});

//Method to compare encrypted password
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pass, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Geo Schema
const zipCode = new Schema({
    _id : Number,
    nm : String,
    st : String,
    cty : String,
    pos : Array
})


// Export
module.exports.articles = mongoose.model('Articles', articleSchema,'articles');

module.exports.users = mongoose.model('Users', userSchema,'users');

module.exports.zipCode = mongoose.model('Cities', zipCode,'cities');