import mongoose from 'mongoose';
import TestSuiteSchema from '../schemas/test-suite-schema';

var TestSuiteModel = mongoose.model('TestSuiteModel', TestSuiteSchema);

export default TestSuiteModel;