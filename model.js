const mongoose = require('mongoose');
const uuid = require('uuid');


let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Enter the name of the user"
    },
    email: {
        type: String,
        required: "Enter an email"
    },
    password: {
        type: String,
        required: "Enter a password"
    },
    key: {
        type: String,
        default: uuid.v4()
    }
});

module.exports = mongoose.model('User', userSchema);


let cartSchema = new mongoose.Schema({
    userKey: {
        type: String,
        required: "Enter a user key"
    },
    itemID: {
        type: String,
        required: "Enter an itemID"
    },
    quantity: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Cart', cartSchema);


let itemSchema = new mongoose.Schema({
    itemID: {
        type: Number,
        required: "Enter an item id"
    },
    name: {
        type: String,
        required: "Enter an item name"
    },
    price: {
        type: Number,
        required: "Enter an item price"
    },
    weight: {
        type: Number,
        required: "Enter an item weight in oz"
    },
    rating: {
        type: Number,
        required: "Enter an item rating up to 5"
    },
    protection: {
        type: Number,
        required: "Enter an item protection percentage"
    },
    imgSrc: {
        type: String,
        required: "Enter an item image source"
    }
});

module.exports = mongoose.model('Item', itemSchema);


let orderSchema = new mongoose.Schema({
    userKey: {
        type: String,
        required: "Enter a user key"
    },
    itemID: {
        type: String,
        required: "Enter an itemID"
    }
});

module.exports = mongoose.model('Order', orderSchema);