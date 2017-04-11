var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    pointer: Number,
});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
Schema.plugin(deepPopulate,  {});

module.exports = mongoose.model('Best', Schema);