import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const SubTestSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  steps: [{ type: mongoose.Schema.Types.Mixed }],
}, { collection : 'sub-tests' });

export default SubTestSchema;
