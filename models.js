var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
module.exports.User = mongoose.model('User', new Schema({
  id:           ObjectId,
  facebook_id:  {type: String},
  firstName:    { type: String, required: '{PATH} is required.' },
  lastName:     { type: String, required: '{PATH} is required.' },
  email:        { type: String, required: '{PATH} is required.', unique: true },
  password:     { type: String, required: '{PATH} is required.' },
  username:			{ type: String, required: '{PATH} is required.', unique: true },
  provider: 		{ type: String},
  permissions:  { type: [String]},
  data:         Object,
}));

module.exports.Config = mongoose.model('Config', new Schema({
  id:           ObjectId,
  name:         { type: String, required: 'Configs require a Name'},
  value:        { type: Boolean, required: 'Configs require a Value'}
}));

module.exports.ConfigCategory = mongoose.model('ConfigCategory', new Schema({
  id:           ObjectId,
  name:         { type: String, required: 'ConfigurationsCategorys require a name', unique: true },
  configs:      { type: Object},
  permissions:  { type: [String]}
}));