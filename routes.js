const mongoose = require('mongoose');

let User = mongoose.model("User");
let Cart = mongoose.model("Cart");
let Item = mongoose.model("Item");
let Order = mongoose.model("Order");


exports.verifyKey = (req, res, next) => {
    User.find({ key: req.query.key},(err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        if(result.length) next();
        else res.send("Invalid key");
    });
}


exports.root = (req, res) => {
    res.send("Working");
}


//Item
exports.item__getList = (req, res) => {
    Item.find({}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}


//User
exports.user__create = (req, res) => {
    //name, email, password
    let newUser = new User(req.body);
    newUser.save((err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}

exports.user__update = (req, res) => {
    //name, email, password
    User.findOneAndUpdate({key: req.query.key}, req.body, (err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        res.json(result);
    });
}

exports.user__delete = (req, res) => {
    User.findOneAndDelete({key: req.query.key}, (err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        res.json(result);
    });
}

exports.user__getKey = (req, res) => {
    User.find({email: req.body.email, password: req.body.password}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}


//Cart
exports.cart__getList = (req, res) => {
    Cart.find({userKey: req.query.key}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}

exports.cart__create = (req, res) => {
    //userKey, itemID
    let newCartItem = new Cart(req.body);
    newCartItem.save((err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}



//Order
exports.order__create = (req, res) => {
    //remove all items from cart list and put in order list
    Cart.find({userKey: req.query.key}, (err, result) => {
        if(err) res.send(err);
        console.log(result);
        for(let item in result) {
            console.log(item);
            let newOrder = new Order(item);
            newOrder.save((err, result) => {
                if(err) res.send(err);
                res.json(result);
            });
        }
    });
    
}

exports.order__getList = (req, res) => {
    Order.find({userKey: req.query.key}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}