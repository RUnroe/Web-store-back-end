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
    userID: {
        type: String,
        required: "Enter a userID"
    },
    itemID: {
        type: String,
        required: "Enter an itemID"
    }
});

module.exports = mongoose.model('Cart', cartSchema);


let itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Enter an item name"
    },
    price: {
        type: Number,
        required: "Enter an item price"
    },
    imgSrc: {
        type: String,
        required: "Enter an item image source"
    }
});

module.exports = mongoose.model('Item', itemSchema);


let orderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: "Enter a userID"
    },
    itemID: {
        type: String,
        required: "Enter an itemID"
    }
});

module.exports = mongoose.model('Order', orderSchema);