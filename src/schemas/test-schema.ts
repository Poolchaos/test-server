import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const TestSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  testSuiteId: {
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
}, { collection : 'tests' });

export default TestSchema;
