var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var OrganisationsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  name: String,
  users: [Schema.Types.Mixed]
}, { collection : 'organisations' });

module.exports = OrganisationsSchema;