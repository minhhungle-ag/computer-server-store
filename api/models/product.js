const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: String,
    description: String,
    price: Number,
    name: String,
    imageUrl: String,
    createdAt: Number,
    updatedAt: Number,
})

module.exports = mongoose.model('Product', productSchema)
