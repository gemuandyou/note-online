var express = require("express");
var noteRouter = require("./router/note");
var userRouter = require("./router/user");
var tagRouter = require("./router/tag");
var bodyParser = require('body-parser');

var app = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

noteRouter(app);
userRouter(app);
tagRouter(app);

app.listen('4000', '127.0.0.1');
