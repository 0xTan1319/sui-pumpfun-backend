var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
    },
    
    email: {
        type: String,
        index: {
            unique: true
        },
        required: true
    }, 

    phone: {
        type: String
    },
  
    password: {
        type: String,
        required: true
    },

    refer: {
        type: [Object],
        default: []
    },

    points: {
        type: Number,
        default: 0
    },

    created_at: {
        type: Date,
        required: true
    },

    last_login: Date
})

UserSchema.methods.comparePassword = function (input, callback) {
    bcrypt.compare(input, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);