import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
// @ts-ignore
const ObjectId = mongoose.Types.ObjectId;

import TestSuiteModel from '../models/test-suite-model';
import TestModel from '../models/test-model';

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
  try {
    const testSuites = await TestSuiteModel.find();
    res.json(testSuites);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:testSuiteId', async (req, res) => {
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

// Create test
router.post('/:testSuiteId', async (req, res) => {
  try {
    console.log(' ::>> attempting to insert new test ');
    const testSuiteId = req.params.testSuiteId;
    const testId = new ObjectId();
    const requestData = {
      testId,
      name: req.body.name,
      type: req.body.type
    };
    console.log(' ::>> new test content ', JSON.stringify(requestData));
    
    const updatedTestSuite = await TestSuiteModel.findOneAndUpdate(
      { _id: new ObjectId(testSuiteId) },
      { $push: { tests: requestData } },
      { new: true }
    );

    const fullTestSuite = {
      _id: testId,
      testSuiteId,
      ...req.body
    };
    const newTest = new TestModel(fullTestSuite);
    newTest.save();

    if (!updatedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }

    // Respond with the updated test suite
    res.json(fullTestSuite);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get test
router.get('/:testSuiteId/test/:testId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const testId = req.params.testId;
    const test: any = await TestModel.findOne({ _id: new ObjectId(testId) });

    if (!test || !test._doc) {
      return res.status(404).json({ error: `Test with ID ${testId} was not found in the Test Suite with ID ${testSuiteId}` });
    }
    res.json({ testSuiteId: req.params.testSuiteId, ...(test._doc || test) });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete test
router.delete('/:testSuiteId/test/:testId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const testId = req.params.testId;
    
    const updatedTestSuite = await TestSuiteModel.findOneAndUpdate(
      { _id: new ObjectId(testSuiteId) },
      { $pull: { tests: { testId: new ObjectId(testId) } } },
      { new: true }
    );
    if (!updatedTestSuite) {
      return res.status(404).json({ error: 'Test Suite not found' });
    }
    const test = await TestModel.findOneAndRemove({ _id: new ObjectId(testId) });
    if (!test) {
      return res.status(404).json({ error: `Test with ID ${testId} was not found in the Test Suite with ID ${testSuiteId}` });
    }
    res.json({ testSuiteId: req.params.testSuiteId, ...test });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update test
router.post('/:testSuiteId/test/:testId', async (req, res) => {
  try {
    const testSuiteId = req.params.testSuiteId;
    const testId = req.params.testId;

    const test = await TestModel.findOneAndUpdate(
      { _id: new ObjectId(testId) },
      { $set: { steps: req.body.steps } },
      { new: true }
    );
    if (!test) {
      return res.status(404).json({ error: `Test with ID ${testId} was not found in the Test Suite with ID ${testSuiteId}` });
    }

    res.status(201).json(test);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
