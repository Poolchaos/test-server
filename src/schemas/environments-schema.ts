import mongoose from 'mongoose';

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

export default EnvironmentsSchema;