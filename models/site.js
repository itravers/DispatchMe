// app/models/site.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var siteSchema = mongoose.Schema({
  name              : String,
  configCategories  : { type : Array , "default" : [] }
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Site', siteSchema);
