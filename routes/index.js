var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const TestSuiteModel = require('../models/test-suite-model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/testsuites', async (req, res) => {
  try {
    const { name } = req.body;
    const doc = {
      _id: new ObjectId(),
      name: name,
      tests: []
    };
    
    const newTestSuite = new TestSuiteModel(doc);
    newTestSuite.save();
    res.json(doc);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/testsuites', async (req, res) => {
  try {
    const testSuites = await TestSuiteModel.find();
    res.json(testSuites);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/testsuites/:testSuiteId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const deletedTestSuite = await TestSuiteModel.findOneAndRemove({ _id: new ObjectId(testSuiteId) });

    if (!deletedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }
    res.json({ message: 'Test Suite deleted successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/testsuites/:testSuiteId', async (req, res) => {
  try {
    console.log(' ::>> insert new test ');
    const testSuiteId = req.params.testSuiteId;
    const requestData = {
      testId: new ObjectId(),
      ...req.body
    };
    console.log(' ::>> insert new test ', JSON.stringify(requestData));
    
    // Find the test suite by its _id and update the "tests" field
    const updatedTestSuite = await TestSuiteModel.findOneAndUpdate(
      { _id: new ObjectId(testSuiteId) }, // Match by _id
      { $push: { tests: requestData } }, // Add requestData to the "tests" array
      { new: true } // Return the updated document
    );

    if (!updatedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }

    // Respond with the updated test suite
    res.json(updatedTestSuite);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/testsuites/:testSuiteId/test/:testId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const testId = req.params.testId;

    const testSuite = await TestSuiteModel.findOne({ _id: new ObjectId(testSuiteId) });

    if (!testSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }

    const specificTest = testSuite.tests.find(test => test.testId.toString() === testId);

    if (!specificTest) {
      return res.status(404).json({ error: 'Test not found in the Test Suite' });
    }

    res.json({ testSuiteId: req.params.testSuiteId, ...specificTest });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
