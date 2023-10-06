import express from 'express';
var router = express.Router();

import TestResultsModel from '../models/test-results-model';

router.get('/', async (req, res) => {
  const testId = req.query.testId;
  console.info(' ::>> testId >>> ' + testId);
  try {
    const testResults = await TestResultsModel.findOne({ testId });
    res.json(testResults);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:testId', async (req, res) => {
  const testId = req.params.testId;
  const testResultId = req.query.testResultId;
  console.info(' ::>> testId >>> ' + testId);
  try {
    const testResults = await TestResultsModel.findOne({ testId });
    // @ts-ignore
    const specificTest = testResults.results.find(result => result._id.toString() === testResultId);
    res.json(specificTest);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;