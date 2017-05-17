var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
   searchString : String
}, {timestamps: true});

var modelClass = mongoose.model('searchString', searchSchema);

module.exports = modelClass;