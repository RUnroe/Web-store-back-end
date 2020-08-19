const mongoose = require('mongoose');


exports.verifyAPIKey = (req, res, next) => {
    User.find({ key: req.query.key},(err, result) => {
        if(err) res.send(`Error: cannot find ${err.value}`);
        if(result.length) next();
        else res.send("Invalid key");
    });
}


exports.root = (req, res) => {
    res.send("Working");
}