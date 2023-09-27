import mongoose from 'mongoose';
import TestResultsSchema from '../schemas/test-results-schema';

var TestResultsModel = mongoose.model('TestResultsModel', TestResultsSchema);

export default TestResultsModel;