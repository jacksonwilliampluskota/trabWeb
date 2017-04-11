var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/puzzle', { server: { socketOptions: { connectTimeoutMS: 180000, socketTimeoutMS: 180000 } } });

var frontend = express.static('../public');
app.use('/', frontend);

app.use('/login', require('./app/login'));
app.use('/best', require('./app/best'));

server.listen(8383, function () {
	console.log('server on 8383');
});