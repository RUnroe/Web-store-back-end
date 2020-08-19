const express = require('express');
let app = express();

const routes = require('./routes')


app.get('/', (req, res) => {
    res.send('API working');
});








app.listen(3001);