// app/models/site.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var formElementSchema = mongoose.Schema({
  name              : String,
  type              : String,
  value             : String,
  label             : String,
  explaination      : String
});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('FormElement', formElementSchema);
