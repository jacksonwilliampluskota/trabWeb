var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    login: String,
    status: String,
    idFb: String,
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
Schema.plugin(deepPopulate,  {});

module.exports = mongoose.model('Login', Schema);