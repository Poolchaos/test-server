var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var TestSuiteSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  name: String,
  tests: [Schema.Types.Mixed]
}, { collection : 'test-suites' });

module.exports = TestSuiteSchema;