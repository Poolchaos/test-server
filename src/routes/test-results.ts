import express from 'express';
import { promises as fs } from 'fs';
import { error } from 'src/tools/logger';

import TestResultsModel from '../models/test-results-model';

var router = express.Router();
const environment = process.env.NODE_ENV;
const shareDrivePath = environment === 'development' ? './screenshots/' : './share/';

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
    let specificTest: any = testResults.results.find(result => result._id.toString() === testResultId);

    // try {
    //   specificTest.image = await fs.readFile(`${shareDrivePath}test-${this.testId}-${this.startTime}/errors/screenshot-${index}-${step.name}.png`);
    //   specificTest.thumbnail = await fs.readFile(`${shareDrivePath}test-${this.testId}-${this.startTime}/errors/thumbnails/screenshot-${index}-${step.name}.png`);
    // } catch(e) {
      
    //   try {
    //     let image = await fs.readFile(`${shareDrivePath}test-${this.testId}-${this.startTime}/errors/screenshot-${index}-${step.name}.png`);
    //     let thumbnail = await fs.readFile(`${shareDrivePath}test-${this.testId}-${this.startTime}/errors/thumbnails/screenshot-${index}-${step.name}.png`);

    //     specificTest.error = {
    //       image,
    //       thumbnail
    //     };
    //     console.log('Error finding screenshot due to', e);
    //   } catch (e) {
    //     error('Failed to load image due to ', e);
    //   }
    // }


    res.json(specificTest);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;