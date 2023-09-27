const mongoose = require('mongoose');

const TestResultsSchema = require('../schemas/test-results-schema');

var TestResultsModel = mongoose.model('TestResultsModel', TestResultsSchema);

module.exports = TestResultsModel;