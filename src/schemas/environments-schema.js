var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var EnvironmentsSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  name: String,
  url: String
}, { collection : 'environments' });

module.exports = EnvironmentsSchema;