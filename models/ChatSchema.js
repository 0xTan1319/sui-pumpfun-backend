var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const ChatSchema = new Schema({
    from_id: {
        type: String,
    },

    product_id: {
        type: String
    },

    to_id: {
        type: String
    },

    read: {
        type: Boolean,
        default: false
    },

    message: {
        type: String,
    },

    created_at: {
        type: Date,
        required: true
    },
})


module.exports = mongoose.model('Chats', ChatSchema);