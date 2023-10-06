import mongoose from 'mongoose';
import TestSchema from '../schemas/test-schema';

var TestModel = mongoose.model('TestModel', TestSchema);

export default TestModel;