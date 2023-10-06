import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
// @ts-ignore
const ObjectId = mongoose.Types.ObjectId;

import SubTestModel from '../models/sub-test-model';

// Get all sub-tests
router.get('/', async (req, res) => {
  try {
    const subTests = await SubTestModel.find();
    res.json(subTests);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create sub-test
router.post('/', async (req, res) => {
  try {
    const { name, type, steps } = req.body;
    const doc = {
      _id: new ObjectId(),
      name,
      type,
      steps
    };
    
    const subTest = new SubTestModel(doc);
    subTest.save();
    res.status(201).json(subTest);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get sub-test
router.get('/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    const test: any = await SubTestModel.findOne({ _id: new ObjectId(testId) });

    if (!test || !test._doc) {
      return res.status(404).json({ error: `Sub-test with ID ${testId} was not found.` });
    }
    res.json({ ...(test._doc || test) });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete test
router.delete('/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    
    const test = await SubTestModel.findOneAndRemove({ _id: new ObjectId(testId) });
    console.log(' ::>> test ', test);
    if (!test) {
      return res.status(404).json({ error: `Test with ID ${testId} was not found` });
    }
    res.json({ status: 'deleted', testId });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
