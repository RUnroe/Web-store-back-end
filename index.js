const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true ); 
mongoose.set('useUnifiedTopology', true ); 


let app = express();

app.use(cors());

let tables = require('./model');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/WebStoreDB");

const routes = require("./routes");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());





app.get("/", routes.root);



app.listen(3001);