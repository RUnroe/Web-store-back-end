const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
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

hashString = (value, callback, req, res) => {
    bcrypt.hash(value, null, null, (err, hash) => {
        callback(hash, req, res);
    });
}

exports.root = (req, res) => {
    res.send("Working");
}


//Validate key
exports.key__validate = (req, res) => {
    User.find({key: req.query.key}, (err, result) => {
        if(err) res.send(err);
        console.log(result)
        if(result.length) res.send(true);
        else res.send(false);
    })
}

//Item
exports.item__getList = (req, res) => {
    Item.find({}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}

exports.item__getDetails = (req, res) => {
    Item.findOne({itemID: req.params.id}, (err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}

//User
exports.user__create = (req, res) => {
    //name, email, password
    hashString(req.body.password, createUser, req, res);
    
}

createUser = (hash, req, res) => {
    let userData = {
        name: req.body.name,
        email: req.body.email,
        password: hash
    };
    let newUser = new User(userData);
    newUser.save((err, result) => {
        if(err) res.send(err);
        res.json(result);
    });
}




exports.user__update = (req, res) => {
    //name, email, password
    if(req.body.password) hashString(req.body.password, updateUser, req, res);
    else updateUser(req.body.password, req, res);
}

updateUser = (password, req, res) => {
    let userData = {
        name: req.body.name,
        email: req.body.email,
        password: password
    }
    User.findOneAndUpdate({key: req.query.key}, userData, (err, result) => {
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
    console.log(`Password: '${req.body.password}'`);
    User.find({email: req.body.email}, (err, user) => {
        if(err || !req.body.password || !user.length) {
            res.json(err);
            return;
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) res.json(err);
            if(result) res.json({"name": user[0].name, "key": user[0].key, "email": user[0].email});
        });
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