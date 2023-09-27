import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var AuthSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, 'No identifier specified.']
  },
  username: {
    type: String,
    required: [true, 'No username specified']
  },
  password: {
    type: String,
    required: [true, 'No password specified.']
  }
}, { collection : 'authentication' });

export default AuthSchema;