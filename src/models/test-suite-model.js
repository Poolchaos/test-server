const mongoose = require('mongoose');

const TestSuiteSchema = require('../schemas/test-suite-schema');

var TestSuiteModel = mongoose.model('TestSuiteModel', TestSuiteSchema);

module.exports = TestSuiteModel;