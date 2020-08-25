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
    User.find({email: req.body.email}, (err, user) => {
        if(user.length || err) {
            res.json(false);
            return;
        }
        else {
            hashString(req.body.password, createUser, req, res);
        }
    });
    
    
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
    User.find({key: { $ne: req.query.key }, email: req.body.email}, (err, user) => {
        if(user.length || err) {
            res.json(false);
            return;
        }
        else {
            if(req.body.password) hashString(req.body.password, updateUser, req, res);
            else updateUser(req.body.password, req, res);
        }
    });
    
}

updateUser = (password, req, res) => {
    let userData = {
        name: req.body.name,
        email: req.body.email,
    }
    if(req.body.password) userData.password = password;
    User.findOneAndUpdate({key: req.query.key}, userData, (err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        res.json({"name": req.body.name, "email": req.body.email});
    });
}

exports.user__delete = (req, res) => {
    User.findOneAndDelete({key: req.query.key}, (err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        res.json(result);
    });
}

exports.user__getKey = (req, res) => {
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
        Item.find({}, (err, itemList) => {
            if(err) res.send(err);   
            let userItems = [];
            for(let i = 0; i < result.length; i++) {
                for(let j = 0; j < itemList.length; j++) {
                    if(result[i].itemID == itemList[j].itemID) {
                        userItems.push({
                            itemID: result[i].itemID,
                            name: itemList[j].name,
                            quantity: result[i].quantity,
                            price: itemList[j].price
                        });
                    }
                }
                
            }
            res.json(userItems);
        });
    });
}

exports.cart__create = (req, res) => {
    //userKey, itemID
    Cart.find({userKey: req.query.key}, (err, result) => {
        if(err) res.send(err);
        let item = null;
        for(let i = 0; i < result.length; i++) {
            if(result[i].itemID == req.body.itemID) {
                item = result[i];
                break;
            }
        }
        if(item) {
            Cart.findOneAndUpdate({userKey: req.query.key, itemID: req.body.itemID}, {quantity: (item.quantity + 1)}, (err, result) => {
                if(err) res.send(`Error: cannot find ${err.value}`);
                res.json(result);
            });
        }
        else{
            let newCartItem = new Cart({userKey: req.query.key, itemID: req.body.itemID});
            newCartItem.save((err, result) => {
                if(err) res.send(err);
                res.json(result);
            });
        }
    });
}

exports.cart__update = (req, res) => {
    req.body.cart.forEach(item => {
        if(item.quantity <= 0) {
            Cart.findOneAndDelete({userKey: req.query.key, itemID: item.itemID}, (err, result) => {
                if(err) {
                    res.send(`Error: cannot find ${err.value}`);
                    return;
                }
            });
        }
        else{
            Cart.findOneAndUpdate({userKey: req.query.key, itemID: item.itemID}, item, (err, result) => {
                if(err) {
                    res.send(`Error: cannot find ${err.value}`);
                    return;
                }
            });
        }
    });
    res.json(true);
}

//Order
exports.order__create = (req, res) => {
    //remove all items from cart list and put in order list
    Cart.find({userKey: req.query.key}, (err, result) => {
        if(err) res.send(err);
        result.forEach(item => {
            if(item.itemID && item.quantity) {
                let newOrder = new Order({"userKey": item.userKey, "itemID": item.itemID, "quantity": item.quantity});
                newOrder.save((err, result) => {
                    if(err) res.send(err);
                });
                Cart.findOneAndDelete({_id: item._id, userKey: req.query.key}, (err, result) => {
                    if(err) res.send(err);
                });
            }
        });
        res.json(true);
    });
    
}

exports.order__getList = (req, res) => {
    Item.find({}, (err, items) => {
        if(err) res.send(err);

        Order.find({userKey: req.query.key}, (err, result) => {
            if(err) res.send(err);
            let retArray = [...result];
            for(let j = 0; j < retArray.length; j++) {
                for(let i = 0; i < items.length; i++) {
                    if(items[i].itemID == retArray[j].itemID) {
                        retArray[j].name = items[i].name;
                        break;
                    }
                }
            }
            res.json(retArray);
        }).lean();
    });
    
}