// app/models/site.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var siteSchema = mongoose.Schema({
  name              : String,
  email             : String,
  tagLine           : String,
  templateFile      : String,
  thumbnail         : String,
  configCategories  : { type : Array , "default" : [] },
  owners            : { type : Array , "default" : [] },//contains an array of owners
  formElements      : { type : Array , "default" : [] } //contains an array of form prototypes
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Site', siteSchema);
