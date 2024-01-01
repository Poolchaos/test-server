import express from 'express';
import { promises as fs } from 'fs';
import { error } from '../tools/logger';

import TestResultsModel from '../models/test-results-model';

var router = express.Router();

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
  const images = req.query.images;
  console.info(' ::>> testId >>> ' + testId, images);
  try {
    const testResults = await TestResultsModel.findOne({ testId });
    // @ts-ignore
    let test: any = testResults.results.find(result => result._id.toString() === testResultId);

    // get thumbnail for each image in test
    try {
      test.thumbnail = await fs.readFile(test.thumbnail);
      console.log(' ::>> thumbnail populated ');
    } catch(e) {
      error('Failed to load image due to ', e);
    }

    res.json(test);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;