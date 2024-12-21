var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const MemeSchema = new Schema({
    product_id: {
        type: String,
        index: {
            unique: true
        },
        required: true
    },

    user_id: {
        type: String,
    },

    product_name: {
        type: String,
    },

    created_at: {
        type: Date,
        required: true
    },
})


module.exports = mongoose.model('Product', MemeSchema);