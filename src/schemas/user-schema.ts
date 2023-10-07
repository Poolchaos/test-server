import mongoose from 'mongoose';

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  organisationId: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified']
  },
  name: String,
  email: String,
  password: String,
  role: String
}, { collection : 'users' });

export default UserSchema;